import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="text-3xl text-primary font-bold font-baloo mr-2">
                <i className="ri-code-box-line"></i>
              </div>
              <h2 className="text-xl font-bold font-baloo text-primary">CodeKids</h2>
            </div>
            <p className="text-gray-600 text-sm mt-1">Making coding fun for kids aged 6-12</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/parents">
              <a className="text-gray-600 hover:text-primary transition-colors duration-200" title="Parents">
                <i className="ri-parent-line text-xl"></i>
              </a>
            </Link>
            <Link href="/help">
              <a className="text-gray-600 hover:text-primary transition-colors duration-200" title="Help">
                <i className="ri-question-line text-xl"></i>
              </a>
            </Link>
            <Link href="/settings">
              <a className="text-gray-600 hover:text-primary transition-colors duration-200" title="Settings">
                <i className="ri-settings-line text-xl"></i>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
