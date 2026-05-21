"use client";
import { ContactModalProps } from '@/lib';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";


export default function ContactModal({
  name,
  address,
  phone,
  email,
  mapQuery,
  facebook,
  instagram,
}: ContactModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white border-2 border-cyan-500 hover:bg-white hover:text-cyan-900 hover:border-cyan-900 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
          Contact Department
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[90vw] !w-[90vw] p-0 overflow-hidden rounded-2xl shadow-2xl border-0 h-[80vh]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left: Contact Info */}
          <div className="flex-1 bg-cyan-900 text-white p-8 flex flex-col justify-center min-h-[300px] lg:min-h-full">
            <DialogHeader>
              <DialogTitle className="text-4xl font-bold mb-8 text-white tracking-tight drop-shadow-lg -mt-24">
                {name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-10">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="inline-block text-cyan-200" />
                  Address
                </h3>
                <p className="text-lg text-cyan-100 pl-7" style={{ whiteSpace: 'pre-line' }}>
                  {address}
                </p>
              </div>
              {/* Phone and Email on the same line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pl-1 pt-8">
                {/* Row 1: Phone & Facebook */}
                <div className="flex items-center gap-2">
                  <Phone className="inline-block text-cyan-200" />
                  <a href={`tel:${phone}`} className="text-lg text-cyan-100 hover:underline transition-all duration-200">{phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="inline-block text-cyan-200" />
                  <a href={`mailto:${email}`} className="text-lg text-cyan-100 hover:underline transition-all duration-200">{email}</a>
                </div>
                
                {/* Row 2: Email & Instagram */}
                {facebook && (
                  <div className="flex items-center gap-2">
                    <Facebook className="inline-block text-cyan-200" />
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-cyan-100 hover:underline"
                    >
                      {facebook.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="inline-block text-cyan-200" />
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-cyan-100 hover:underline"
                    >
                      {instagram.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right: Google Map */}
          <div className="flex-1 bg-white flex items-center justify-center p-4">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border-2 border-cyan-100 min-h-[400px]">
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                style={{ minHeight: 400, border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}