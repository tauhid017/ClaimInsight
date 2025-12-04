"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Clock, BarChart3 } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-light to-cyan text-white flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-purple/30 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-white text-cyan rounded-lg px-3 py-1.5 font-bold text-lg">
              CI
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow">
              ClaimInsight
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-white border-white/50 hover:bg-white/20 bg-transparent"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="bg-cyan text-white hover:bg-cyan-dark"
              onClick={() => navigate("/login")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg">
          AI-Generated Loss Descriptions in Seconds
        </h2>

        <p className="text-xl text-white/90 max-w-2xl mx-auto mt-6">
          ClaimInsight transforms insurance assessments. Upload an image and instantly receive a professional,
          accurate loss description — saving hours of manual work.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
          <Button
            size="lg"
            className="bg-white text-cyan font-bold hover:bg-cyan-dark hover:text-white text-lg px-10 py-6 rounded-xl"
            onClick={() => navigate("/login")}
          >
            Get Started Free
          </Button>
          <a href="">
            <Button
            size="lg"
            variant="outline"
            className="text-white border-white/60 hover:bg-white/20 text-lg px-10 py-6 rounded-xl bg-transparent"
            // onClick={() => navigate("/login")}
          >
            Watch Demo
          </Button>
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white/10 backdrop-blur-md py-20 border-y border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center text-3xl font-bold mb-4">Why Choose ClaimInsight?</h3>
          <p className="text-center text-white/80 text-lg mb-14 max-w-2xl mx-auto">
            Built for insurance professionals who value accuracy, speed, and reliability.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6 hover:border-cyan transition-colors">
              <Zap className="w-10 h-10 text-cyan mb-4" />
              <h4 className="font-bold text-lg mb-2">Lightning Fast</h4>
              <p className="text-white/80">Generate professional descriptions in seconds.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6 hover:border-cyan transition-colors">
              <BarChart3 className="w-10 h-10 text-cyan mb-4" />
              <h4 className="font-bold text-lg mb-2">Highly Accurate</h4>
              <p className="text-white/80">AI-powered analysis ensures detailed reporting.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6 hover:border-cyan transition-colors">
              <Clock className="w-10 h-10 text-cyan mb-4" />
              <h4 className="font-bold text-lg mb-2">Save Time</h4>
              <p className="text-white/80">Reduce manual documentation by up to 80%.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6 hover:border-cyan transition-colors">
              <CheckCircle2 className="w-10 h-10 text-cyan mb-4" />
              <h4 className="font-bold text-lg mb-2">Reliable</h4>
              <p className="text-white/80">Enterprise-grade secure and consistent output.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-center text-3xl font-bold mb-12">Who It's For</h3>

        <div className="space-y-5 max-w-2xl mx-auto">
          {[
            { title: "Insurance Assessors", desc: "Instant loss descriptions during field inspections." },
            { title: "Loss Adjusters", desc: "Fast and accurate claim analysis." },
            { title: "Claim Handlers", desc: "Reduce paperwork and improve turnaround time." },
            { title: "Insurance Companies", desc: "Cut operational costs with automation." }
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-white/10 border border-white/20 rounded-lg hover:border-cyan transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-cyan text-white rounded-full flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-white/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-white/10 py-16 border-y border-white/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-4">About ClaimInsight</h3>

          <p className="text-white/80 leading-relaxed mb-6">
            ClaimInsight uses cutting-edge AI and deep learning to automate insurance loss documentation. 
            Our intelligent system analyzes damage images and generates polished, professional loss descriptions 
            instantly — removing manual work and reducing human error.
          </p>

          <div className="bg-white/10 border border-white/20 rounded-lg p-5 inline-block">
            <p className="text-white/70 mb-1">Created by</p>
            <p className="text-xl font-bold text-white">
              Shaikh Tauhid & Shivam Verma
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-cyan to-cyan-dark py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">
            Ready to Transform Your Claims Process?
          </h3>
          <p className="text-white/90 text-lg mb-8">
            Join hundreds of professionals already using ClaimInsight.
          </p>
          <Button
            size="lg"
            className="bg-white text-cyan-dark hover:bg-cyan-dark hover:text-white text-lg px-10"
            onClick={() => navigate("/login")}
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/20 py-6 text-center text-white/70 text-sm">
        © {new Date().getFullYear()} ClaimInsight — All Rights Reserved.
      </footer>
    </div>
  );
}
