export interface Release {
    id: number;
    title: string;
    url_title: string;
    soundcloud_url: string;
    cover_art_full?: string;
    cover_art_thumbnail?: string;
    collaborators?: string;
    release_date: string;
    created_at: string;
    updated_at: string;
    links?: ReleaseLink[];
}

export interface ReleaseLink {
    id: number;
    release_id: number;
    platform: 'spotify' | 'soundcloud' | 'apple_music' | 'youtube';
    url: string;
    created_at: string;
}

export interface CreateReleaseData {
    title: string;
    url_title: string;
    soundcloud_url: string;
    collaborators?: string;
    release_date: string;
    links?: Omit<ReleaseLink, 'id' | 'release_id' | 'created_at'>[];
} 