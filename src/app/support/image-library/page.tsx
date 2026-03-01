import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Library",
  description:
    "Learn how to use the image library to search, upload, manage, and organize your images.",
};

export default function ImageLibraryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://wdwoabxlzlvfztthneva.supabase.co/storage/v1/object/public/images/socialshare/image-37-1536x723.png"
            alt="Image Library overview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            Image Library
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            Manage all of your images in one place. Search, upload, organize, and perform bulk actions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 space-y-12">
          {/* Controls */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal md:text-3xl mb-6">
              Controls
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Search Bar</h3>
                  <p className="text-warm-gray mt-1">
                    Use the search bar labeled &ldquo;Search by title or product&rdquo; to find specific images.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Upload Photos</h3>
                  <p className="text-warm-gray mt-1">
                    Click this button to upload new images from your device.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">&ldquo;Select all&rdquo; Checkbox</h3>
                  <p className="text-warm-gray mt-1">
                    This is located in the controls section of the page. Checking this box will select every image currently visible in your gallery, making them available for bulk actions. A dropdown menu labeled Actions will appear next to it once an image is selected.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Actions Dropdown</h3>
                  <p className="text-warm-gray mt-1 mb-3">
                    This menu allows you to perform bulk actions on selected images.
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Delete:</span> Delete Selected Images or All images in library. Note that deleting an image removes it from all associated products.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Download:</span> Download Selected Images or All images in library in a .zip file format.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">View Toggle</h3>
                  <p className="text-warm-gray mt-1">
                    Switch between Grid and List views for your images. The active view is highlighted.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Sort by</h3>
                  <p className="text-warm-gray mt-1">
                    This dropdown allows you to sort images by Date, Size, or Name. Selecting an option will automatically update the gallery&apos;s order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal md:text-3xl mb-6">
              Image Gallery
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Image Card</h3>
                  <p className="text-warm-gray mt-1 mb-3">
                    Each image is displayed in a card format.
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Image Checkbox:</span> Use the checkbox in the top-left corner of each card to select individual images for bulk actions.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Feature Image Star:</span> The star icon in the top-right corner of an image indicates it is a featured image. Clicking on this star likely designates the image as a featured image for a specific product.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Image Thumbnail:</span> The thumbnail displays a preview of the image. Hovering over it reveals an overlay with the text &ldquo;View Details,&rdquo; and clicking it opens a modal window with a larger preview and options to edit the image.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Image Information</h3>
                  <p className="text-warm-gray mt-1">
                    Below each image thumbnail, you&apos;ll find the image&apos;s name. Hovering over the name shows the original title of the image.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                <div>
                  <h3 className="font-semibold text-charcoal">Image Actions</h3>
                  <p className="text-warm-gray mt-1 mb-3">
                    A row of icons under each image provides specific actions for that single image.
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Edit (Pencil icon):</span> Edit the image&apos;s details, such as its name or cropping.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Delete (Trash can icon):</span> Delete the individual image. This action will prompt a confirmation modal to ensure you want to proceed.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Download (Download icon):</span> Download the individual image to your device.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold">&ndash;</span>
                      <p className="text-warm-gray">
                        <span className="font-medium text-charcoal">Copy URL (Link icon):</span> Copy the image&apos;s URL to your clipboard.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
