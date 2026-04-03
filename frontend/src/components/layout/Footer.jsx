export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} SkyPoint Job Portal. All rights reserved.
      </div>
    </footer>
  );
}
