import React from 'react';

const Video = () => {
    return (
        <>
            <h2 className="text-3xl text-black font-extralight text-center mt-20 mb-8">Stacioni i autobus&#235;ve, Prishtin&#235;</h2>
            <div className="video-container flex justify-center items-center">
                <div style={{ paddingTop: '21.35%', position: 'relative', width: '80%', maxWidth: '640px' }} className="h-0">
                    {/* Adjusted dimensions for the iframe */}
                    <iframe
                        className="no-margin"
                        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
                        src="https://video.gjirafa.com/embed/slowtv-stacioni-i-autobuseve-prishtine?autoplay=true&am=true"
                        frameborder="0"
                        allow="autoplay"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        </>
    );
}

export default Video;
