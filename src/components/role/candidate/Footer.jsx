import React from "react";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 text-slate-800 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">RecruitmentMS</h3>
            </div>
            <p className="text-slate-300">
              Your trusted partner in finding the perfect career opportunities and connecting talent with employers.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">contact@recruitmentms.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">+91 8460888834</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">plot no 63, Anandaji park-1, opp.Akhalol jakatnaka, Bhavnagar</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">About Us</a>
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-slate-300 hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2025 RecruitmentMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;