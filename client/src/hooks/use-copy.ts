import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const useCopy = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback((text: string) => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 2000);
                })
                .catch((err) => {
                    toast("Failed to copy", { type: 'error' });
                    console.error("Failed to copy: ", err);
                });
        } else {
            toast("Clipboard API is not available.", { type: 'error' });
        }
    }, []);

    return { isCopied, copyToClipboard };
};

export default useCopy;
