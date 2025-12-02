import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <div className="flex flex-col items-center gap-12 p-12">
      {/* Left side text */}
      <div className="text-center flex-1">
        <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
        <p>This is the Contact page.</p>
      </div>

      {/* Right side textarea */}
      <div className="w-128 mt-24 flex flex-col space-y-4">
        <Button className="self-start hover:bg-amber-400" variant="outline">
          Submit
        </Button>
        <textarea
          className="w-full h-64 p-8 border bg-gray-200 border-gray-400 rounded resize-none"
          name="contact"
          id="contact"
          placeholder="Write your message..."
        ></textarea>
      </div>
    </div>
  );
}
