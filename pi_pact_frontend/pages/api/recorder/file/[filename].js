import getConfig from 'next/config'
import fetcher from '../../../../lib/fetcher'

export default async (req, res) => {
    const {
        query: { filename },
    } = req;
    const { serverRuntimeConfig } = getConfig();
    const url = `${serverRuntimeConfig.api_loc}/api/recorder/file/${filename}`;
    try {
        const data = await fetcher(url);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error %s", error);
        res.status(500).json({ error });
    }
}