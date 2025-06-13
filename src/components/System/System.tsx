import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

function System() {

    async function getSystemInfo() {
        console.log("Fetching system information...");
        const data = await invoke("get_components");
        console.log("System information received:");
        // setComponents(data);
    }

    useEffect(() => {
        getSystemInfo();
    }, []);

    return (
        <div>
            <h1>System Information</h1>
        </div>
    );
}

export default System;