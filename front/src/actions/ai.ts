"use server"

import { Cultivo, EspecificacionesUserPrompt } from "../types";

export const getPrediction = async (data: EspecificacionesUserPrompt) => {
    console.log("Fetching prediction data with:", data);
    try {
        const response = await fetch("http://localhost:4321/prediction/test", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // Habilita la caché de Next.js por 24 horas
        // next: { revalidate: 86400 },
        });
        console.log("Response from prediction endpoint:", response);
        if (!response.ok) {
        // throw new Error("Network response was not ok");
        console.error("Network response was not ok");
        }
    
        const predictionData = await response.json();
        return predictionData;
    } catch (error) {
        console.error("Error fetching prediction data:", error);
        throw error;
    }
}

export const saveRiegoCultivo = async (data: any, cultivo: Cultivo) => {
    console.log("Saving riego cultivo data:", data);
    try {
        const response = await fetch(`http://localhost:4321/riego/${cultivo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log("Response from riego cultivo endpoint:", response);
        if (!response.ok) {
            console.error("Network response was not ok");
        }
    
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error saving riego cultivo data:", error);
        throw error;
    }
}