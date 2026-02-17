import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://rigour.run',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://rigour.run/audits',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://rigour.run/audits/openclaw',
            lastModified: new Date('2026-02-17'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://rigour.run/audits/bolt-diy',
            lastModified: new Date('2026-02-17'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://rigour.run/privacy',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: 'https://rigour.run/terms',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]
}
