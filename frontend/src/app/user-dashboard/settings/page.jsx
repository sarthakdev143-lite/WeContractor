"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Settings = () => {
    const router = useRouter();

    useEffect(() => {
        alert("Still Under Development.")
        router.push("/user-dashboard");
    }, [])

    return (
        <></>
    )
}

export default Settings;