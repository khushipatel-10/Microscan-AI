import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function loadModel() {
    if (model) return model;

    console.log('Loading MobileNet...');
    // Load the model. Using version 2, alpha 1.0 for speed/accuracy balance
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log('MobileNet Loaded');
    return model;
}

export async function extractEmbeddings(imageElement: HTMLImageElement | HTMLVideoElement): Promise<number[]> {
    try {
        const net = await loadModel();
        if (!net) throw new Error("Model failed to load");

        // infer returns the logits/embeddings if we use the internal model access
        // But mobilenet library abstracts this. 
        // For this hackathon, we will use the classification probabilities as a "fingerprint"
        // OR we can try to access the internal model if needed. 
        // To keep it simple and stable: We use the top classifications.
        // actually, for vector search we usually want the penultimate layer.
        // The @tensorflow-models/mobilenet library has an 'infer' method that returns embeddings!

        // valid embedding lookup: 'conv_preds' is usually the logits before softmax
        const embedding = net.infer(imageElement, true); // true = embedding, false = classification

        // embedding is a Tensor. We need to convert to array.
        const data = await embedding.data();

        // Dispose tensor to free memory
        embedding.dispose();

        return Array.from(data);
    } catch (err) {
        console.error("Error extracting embeddings:", err);
        return []; // Return empty vector on failure (graceful degradation)
    }
}
