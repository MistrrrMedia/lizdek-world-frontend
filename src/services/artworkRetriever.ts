export async function getAlbumArtURL(trackUrl: string): Promise<string> {
    try {
        const response = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch SoundCloud data');
        }
        
        const data = await response.json();
        const baseThumb = data.thumbnail_url;
        
        if (!baseThumb) {
            throw new Error('Thumbnail not found');
        }

        // Convert to 1080x1080 PNG format
        return baseThumb.replace('-t500x500', '-t1080x1080').replace('.jpg', '.png');
    } catch (error) {
        console.error('Error fetching SoundCloud artwork:', error);
        throw new Error('Failed to fetch SoundCloud artwork');
    }
} 