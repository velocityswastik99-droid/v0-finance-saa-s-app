"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, TrendingUp, Zap, Lock, BarChart3, DollarSign, CheckCircle2, Star, ArrowRight } from "lucide-react"
import React, { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    const initializeSixthSense = async () => {
      // Skip in development to avoid CORS issues
      if (process.env.NODE_ENV !== 'production') {
        console.log('SixthSense disabled in development');
        return;
      }

      try {
        const ssJS = await import("@sixthsense/sixthsense-javascript-agent");
        
        ssJS.default.register({
          service: "FINANCE-APP",
          collector: 'https://http-collector-observability.sixthsense.rakuten.com/oap/',
          pagePath: window.location.pathname,
          serviceVersion: "1.2.1",
          enableSPA: true,
          useFmp: true,
          autoTracePerf: true,
          enableDirectFetchPatching: false,
          detailMode: true,
          environment: "production",
          authorization: process.env.NEXT_PUBLIC_SIXTHSENSE_TOKEN || "YOUR_TOKEN",
          maxBreadcrumbs: 20,
          skipURLs: [],
          autoBreadcrumbs: {
            xhr: false,
            console: true,
            dom: true,
            location: true
          }
        });
        
        console.log('SixthSense initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize SixthSense:', error);
        // Non-blocking error - app should continue working
      }
    };

    // Add a small delay to ensure page is loaded
    const timer = setTimeout(() => {
      initializeSixthSense();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Rest of your component remains the same...

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Finflow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Trusted by 10,000+ businesses
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Financial clarity for modern businesses
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
              Manage your finances with confidence. Real-time insights, powerful analytics, and enterprise-grade
              security in one beautiful platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="rounded-full h-12 px-8 text-base" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-transparent" asChild>
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="glass rounded-2xl p-4 shadow-2xl">
              <div className="bg-card rounded-xl overflow-hidden border">
                <div className="h-8 bg-muted border-b flex items-center px-4 gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-[#f5a623]" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-accent/5 to-transparent">
                      <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                      <div className="text-3xl font-bold">$124,500</div>
                      <div className="text-sm text-accent mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12.5% from last month
                      </div>
                    </Card>
                    <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-success/5 to-transparent">
                      <div className="text-sm text-muted-foreground mb-1">Cash Flow</div>
                      <div className="text-3xl font-bold">$45,200</div>
                      <div className="text-sm text-success mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +8.3% increase
                      </div>
                    </Card>
                    <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-chart-4/5 to-transparent">
                      <div className="text-sm text-muted-foreground mb-1">Expenses</div>
                      <div className="text-3xl font-bold">$79,300</div>
                      <div className="text-sm text-muted-foreground mt-1">Within budget</div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Everything you need to manage finances</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Powerful features designed for modern businesses and finance teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description:
                  "Track your financial metrics in real-time with interactive dashboards and detailed reports",
              },
              {
                icon: Shield,
                title: "Bank-level Security",
                description: "256-bit encryption and SOC 2 Type II compliance to keep your data safe and secure",
              },
              {
                icon: Zap,
                title: "Automated Insights",
                description: "AI-powered recommendations and automated categorization to save time and reduce errors",
              },
              {
                icon: Lock,
                title: "Data Protection",
                description: "Your financial data is encrypted at rest and in transit with enterprise-grade security",
              },
              {
                icon: TrendingUp,
                title: "Growth Tracking",
                description: "Monitor your business growth with customizable KPIs and performance indicators",
              },
              {
                icon: DollarSign,
                title: "Multi-currency",
                description: "Support for 150+ currencies with real-time exchange rates and automatic conversion",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-8 border-0 shadow-sm hover:shadow-md transition-shadow bg-card">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.4B+</div>
              <div className="text-muted-foreground">Transactions Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Trusted by finance teams worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "CFO at TechCorp",
                content:
                  "Finflow transformed how we handle our finances. The real-time insights are invaluable for making quick decisions.",
                rating: 5,
              },
              {
                name: "Michael Rodriguez",
                role: "Finance Director at StartupXYZ",
                content: "The automation features saved us countless hours. Best financial tool we've ever used.",
                rating: 5,
              },
              {
                name: "Emily Thompson",
                role: "Founder at GrowthLabs",
                content: "Security and ease of use in one package. Finflow is exactly what modern businesses need.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm bg-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{testimonial.content}</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground text-pretty">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for small businesses",
                features: ["Up to 100 transactions/month", "Basic analytics", "Email support", "1 user account"],
              },
              {
                name: "Professional",
                price: "$99",
                description: "For growing companies",
                features: [
                  "Unlimited transactions",
                  "Advanced analytics",
                  "Priority support",
                  "Up to 5 users",
                  "API access",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "Everything in Pro",
                  "Dedicated support",
                  "Unlimited users",
                  "Custom integrations",
                  "SLA guarantee",
                ],
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`p-8 border-0 shadow-sm relative ${plan.popular ? "ring-2 ring-accent shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to transform your finances?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join thousands of businesses managing their finances with confidence
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full h-12 px-8 text-base" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-transparent" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Finflow</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Finflow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}