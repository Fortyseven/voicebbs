import { API_HOST } from "../config";

/**
 * Retrieves the audio file associated with a given shortcode
 * @param {string} shortcode
 */
function getBlob(shortcode) {
    return fetch(`https://${API_HOST}/api/v1/post-blob/${shortcode}`, {
        method: "GET",
    });
}

/**
 * Returns further details of a voice post
 * @param {*} shortcode
 */
function getDetails(shortcode) {
    return fetch(`https://${API_HOST}/api/v1/post/${shortcode}`, {
        method: "GET",
    });
}

/**
 * Stores a new audio recording
 * @param {*} blob
 */
function saveNewAudioPost(blob, duration = 0, reply_to) {
    // TODO: there should be some kind of validation in place to ensure the
    // content being uploaded is what it says it is.

    const output = {
        duration,
        blob,
        reply_to,
    };
    console.log(output);
    return fetch(`https://${API_HOST}/api/v1/post`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(output),
    });
}

export default { getDetails, getBlob, saveNewAudioPost };
