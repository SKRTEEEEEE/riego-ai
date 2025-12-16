"use server"

export const getPlcStatus = async () => {
    try {
        const response = await fetch("http://localhost:4321/plc/status", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
    
        // if (!response.ok) {
        // throw new Error("Network response was not ok");
        // }
    
        const statusData = await response.json();
        return statusData;
    } catch (error) {
        console.error("Error fetching PLC status:", error);
        throw error;
    }
}