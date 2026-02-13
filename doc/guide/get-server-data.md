# getServerData

Pages that need data before render can attach a `getServerData` function to the route component. It runs:

- **On the server** when the request hits an SSR route (the result is serialized into `__PRELOADED_DATA__`).
- **On the client** when the user navigates to that route (e.g. via `useNavigate`) and the data for that route/params is not yet in the context.

Data is keyed by path + params, so revisiting the same URL reuses cached data.

## Example

```tsx
// src/pages/VideoPage.tsx
interface VideoPageProps {
  video: Video;
  relatedVideos: Video[];
}

const VideoPage = ({ video, relatedVideos }: VideoPageProps) => {
  return (
    <div>
      <h1>{video.title}</h1>
      {/* ... */}
    </div>
  );
};

async function getServerData(params?: Record<string, string>) {
  const id = params?.id;
  const [videoRes, relatedRes] = await Promise.all([
    fetch(`/api/videos/${id}`).then((r) => r.json()),
    fetch(`/api/videos/${id}/related`).then((r) => r.json()),
  ]);
  return {
    video: videoRes,
    relatedVideos: relatedRes.data,
  };
}

VideoPage.getServerData = getServerData;
export default VideoPage;
```

The route would be:

```ts
{ path: '/video/:id', Component: VideoPage, isSSR: true }
```

Then `params` in `getServerData` will have `{ id: '...' }` from the URL.

## Rules

- The return value of `getServerData` is passed as props to the page component.
- `params` comes from the path (e.g. `:id` → `params.id`). For the initial SSR request it’s from the requested URL; on client navigation it’s from the current location.
- If `getServerData` throws on the server, the framework logs and sets `preloadedData.is_success = false`; you can handle that in the page if needed.
- Pages without `getServerData` render with no props from the framework (client-only or static).
