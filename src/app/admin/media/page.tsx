import { MediaGallery } from "./media-gallery";

export default function MediaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Media Library</h1>
        <p className="text-warm-gray mt-1">Upload and manage images for your site</p>
      </div>

      <MediaGallery />
    </div>
  );
}
