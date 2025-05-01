import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Image src="/logo.png" alt="AuctaSync Logo" width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">AuctaSync</span>
            </div>
            <p className="mb-6 text-gray-600">
              Revolutionizing the auction experience with cutting-edge technology and user-focused design.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Image 
                      src={`https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80`} 
                      alt={social} 
                      width={24} 
                      height={24} 
                      className="h-4 w-4 object-cover" 
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Resources</h3>
            <ul className="space-y-4">
              {['Documentation', 'Help Center', 'API', 'Status'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'GDPR'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">© {new Date().getFullYear()} AuctaSync. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
