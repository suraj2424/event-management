import React from "react";
import { ArrowRight, Calendar, Users, Zap, Star, Search } from "lucide-react";
import Header from "@/parts/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ILLUSTRATION1 from "@/app/assets/images/illustration1.svg"
import MAIN_LOGO from "@/app/assets/images/a-sleek-and-modern-logo-for-evenzia-a-professional-1IrUvzGaSMGVmzopk656Tg-x9G1NsKCTpOHl4PWrrixIg2.jpeg"
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br relative font-Nunito">
      <div className="h-screen">
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <div className="flex flex-col justify-center items-start w-1/2 pl-32">
            <h1 className="text-4xl md:text-5xl mb-4 text-slate-600">
              Streamline Your Events with <span className="text-cyan-600 text-7xl font-semibold">EVENZIA</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Where Planning Meets Innovation
            </p>
            <Button
              size="lg"
              className="text-indigo-50 hover:bg-indigo-700"
            >
              Get Started Now
            </Button>
          </div>
          <div className="w-1/2 flex justify-end relative">
            <Image
              src={ILLUSTRATION1} // Replace with the path to your image
              alt="Event Illustration"
              width={800} // Adjust size as needed
              height={800} // Adjust size as needed
              className="bg-transparent object-contain " // Adjust blend mode as needed
              draggable="false"
            />
          </div>
        </div>
      </div>
      <main className="container mx-auto px-10 min-h-screen bg-zinc-950">
        <section id="features" className="py-16 px-20">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-white">
            Powerful Tools to Transform Your <span className="text-cyan-400">Event Experience</span>
          </h2>
          <div className="grid md:grid-cols-1 gap-8">
            {[
              {
                icon: <Calendar className="w-12 h-12 mb-4 text-yellow-400" />,
                title_color:"text-yellow-600",
                bg_color:"bg-yellow-200",
                title: "Seamless Event Registration",
                description:
                  "Say goodbye to complex registration processes. Explore events tailored to your interests and register with just a few clicks.",
              },
              {
                icon: <Users className="w-12 h-12 mb-4 text-sky-400" />,
                title_color:"text-sky-600",
                bg_color:"bg-sky-200",
                title: "Advanced Event Management",
                description:
                  "Manage every aspect of your events with our robust platform. From ticketing to analytics, we've got you covered.",
              },
              {
                icon: <Zap className="w-12 h-12 mb-4 text-green-400" />,
                title_color:"text-green-600",
                bg_color:"bg-green-200",
                title: "Scalable Infrastructure",
                description:
                  "Built with Next.js and Redis, our platform handles growth effortlessly. Host events of any size with speed and reliability.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg_color} p-6 rounded-xl hover:drop-shadow-md backdrop-blur-lg transition-all duration-300 ease-in-out`}
              >
                {feature.icon}
                <h3 className={`text-xl font-semibold mb-2 ${feature.title_color}`}>{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="event-search" className="py-16 px-20">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg backdrop-blur-lg">
              <h3 className="text-2xl font-semibold">Find Your Next Event</h3>
              <p className="text-slate-500">Search for events by keyword, category, or location</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search events..."
                className="flex-grow py-2 px-4 rounded-md bg-zinc-800 text-white focus:outline-none selection:text-black selection:bg-white"
              />
              <select className="w-full md:w-[180px] p-2 rounded-md bg-zinc-800 text-white">
                <option value="">Category</option>
                <option value="conferences">Conferences</option>
                <option value="workshops">Workshops</option>
                <option value="networking">Networking</option>
              </select>
              <select className="w-full md:w-[180px] p-2 rounded-md bg-zinc-800 text-white">
                <option value="">Location</option>
                <option value="newyork">New York</option>
                <option value="losangeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
              </select>
              <button className="w-full md:w-auto bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center">
                <Search className="mr-2 w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </section>



        <section id="how-it-works" className="py-16 px-20">
          <h2 className="text-5xl font-bold text-center mb-12 text-white ">
            Three Simple Steps to Manage Your Event
          </h2>
          <div className="grid grid-cols-3 row gap-8">
            {[
              {
                title: "Explore Events",
                description:
                  "Browse through a wide range of events categorized by interest, date, and location.",
              },
              {
                title: "Register Effortlessly",
                description:
                  "Complete your registration in minutes. Fill in your details, choose your ticket, and you're in!",
              },
              {
                title: "Manage Your Experience",
                description:
                  "Access your personalized dashboard to manage orders and receive real-time updates.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex-1 p-6 rounded-lg backdrop-blur-lg bg-zinc-950 text-white hover:bg-zinc-900 transition-all duration-300 ease-in-out"
              >
                <div className="text-5xl font-extrabold mb-4">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-400">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="py-16">
          <h2 className="text-5xl font-bold text-center mb-12 text-white">
            What Our Users Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emily Johnson",
                role: "Event Planner",
                quote:
                  "Evenzia has revolutionized how I handle events. The registration process is incredibly smooth, and the analytics tools provide invaluable insights.",
              },
              {
                name: "Michael Torres",
                role: "Conference Organizer",
                quote:
                  "The advanced features offered by Evenzia allowed us to scale our annual conference effortlessly. Attendee feedback was overwhelmingly positive.",
              },
              {
                name: "Sarah Lee",
                role: "Attendee",
                quote:
                  "I was amazed at how easy it was to find and register for events that matched my interests. The user-friendly interface made everything straightforward!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-zinc-900 p-6 rounded-lg backdrop-blur-lg text-white hover:bg-slate-900 transition-all duration-300 ease-in-out"
              >
                <Star className="w-8 h-8 text-yellow-400 mb-4" />
                <p className="mb-4 text-sm">{testimonial.quote}</p>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-zinc-400">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="py-16">
          <h2 className="text-5xl font-bold text-center mb-8 text-white">Who We Are</h2>
          <p className="text-center max-w-2xl mx-auto text-zinc-500">
            At EVENZIA, we believe in making event planning and
            participation as effortless as possible. Our dedicated team of
            developers and event professionals has worked tirelessly to craft a
            platform that meets the needs of both organizers and attendees. With
            cutting-edge technology at our fingertips, our mission is to create
            memorable, engaging events that bring people together.
          </p>
        </section>

        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Event Experience?
          </h2>
          <p className="mb-8">
            Whether you're an organizer looking for efficient tools or an
            attendee eager to explore exciting activities, EVENTMANAGER is here
            for you.
          </p>
          <button className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center mx-auto">
            Join Us Today
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </section>
      </main>

      <footer className="bg-[#191f2d] py-8">
        <div className="container mx-auto px-4 text-white">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <Image
                src={MAIN_LOGO} // Replace with the path to your image
                alt="Event Illustration"
                width={200} // Adjust size as needed
                height={200} // Adjust size as needed
                className="bg-transparent object-contain " // Adjust blend mode as needed
              />
              <p>Transforming the event landscape, one experience at a time.</p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h4 className="text-lg font-semibold mb-4 text-cyan-500">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">Facebook</span>F
                </a>
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">Twitter</span>T
                </a>
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">LinkedIn</span>L
                </a>
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">Instagram</span>I
                </a>
              </div>
              <p className="mt-4">surajsuryawanshi2424@mgial.com</p>
              <p><span className="text-blue-400">+91</span> 9075450141</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-zinc-500">
            © 2024 EVENZIA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

// import React from 'react';
// import { ArrowRight, Calendar, Users, Zap, Star, Search } from 'lucide-react';
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"

// const LandingPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-950 to-pink-900 text-white">
//       <header className="container mx-auto px-4 py-8">
//         <NavigationMenu>
//           <NavigationMenuList>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#features">Features</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#how-it-works">How It Works</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#testimonials">Testimonials</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#about">About Us</NavigationMenuLink>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//         <div className="text-center mt-16">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Streamline Your Events with EVENTMANAGER</h1>
//           <p className="text-xl md:text-2xl mb-8">Where Planning Meets Innovation</p>
//           <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100">
//             Get Started Now
//             <ArrowRight className="ml-2 w-4 h-4" />
//           </Button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4">
//         <section id="event-search" className="py-16">
//           <Card className="bg-white/10 backdrop-blur-lg">
//             <CardHeader>
//               <CardTitle className="text-2xl">Find Your Next Event</CardTitle>
//               <CardDescription>Search for events by keyword, category, or location</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col md:flex-row gap-4">
//                 <Input placeholder="Search events..." className="flex-grow" />
//                 <Select>
//                   <SelectTrigger className="w-full md:w-[180px]">
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="conferences">Conferences</SelectItem>
//                     <SelectItem value="workshops">Workshops</SelectItem>
//                     <SelectItem value="networking">Networking</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select>
//                   <SelectTrigger className="w-full md:w-[180px]">
//                     <SelectValue placeholder="Location" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="newyork">New York</SelectItem>
//                     <SelectItem value="losangeles">Los Angeles</SelectItem>
//                     <SelectItem value="chicago">Chicago</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Button className="w-full md:w-auto">
//                   <Search className="mr-2 h-4 w-4" /> Search
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         <section id="features" className="py-16">
//           <h2 className="text-3xl font-bold text-center mb-12">Powerful Tools to Transform Your Event Experience</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { icon: <Calendar className="w-12 h-12 mb-4" />, title: "Seamless Event Registration", description: "Say goodbye to complex registration processes. Explore events tailored to your interests and register with just a few clicks." },
//               { icon: <Users className="w-12 h-12 mb-4" />, title: "Advanced Event Management", description: "Manage every aspect of your events with our robust platform. From ticketing to analytics, we've got you covered." },
//               { icon: <Zap className="w-12 h-12 mb-4" />, title: "Scalable Infrastructure", description: "Built with Next.js and Redis, our platform handles growth effortlessly. Host events of any size with speed and reliability." },
//             ].map((feature, index) => (
//               <Card key={index} className="bg-white/10 backdrop-blur-lg">
//                 <CardHeader>
//                   {feature.icon}
//                   <CardTitle>{feature.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         <section id="how-it-works" className="py-16">
//           <h2 className="text-3xl font-bold text-center mb-12">Three Simple Steps to Manage Your Event</h2>
//           <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8">
//             {[
//               { title: "Explore Events", description: "Browse through a wide range of events categorized by interest, date, and location." },
//               { title: "Register Effortlessly", description: "Complete your registration in minutes. Fill in your details, choose your ticket, and you're in!" },
//               { title: "Manage Your Experience", description: "Access your personalized dashboard to manage orders and receive real-time updates." },
//             ].map((step, index) => (
//               <Card key={index} className="flex-1 bg-white/10 backdrop-blur-lg">
//                 <CardHeader>
//                   <CardTitle className="text-4xl font-bold">{index + 1}</CardTitle>
//                   <CardDescription className="text-xl font-semibold">{step.title}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p>{step.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         <section id="testimonials" className="py-16">
//           <h2 className="text-3xl font-bold text-center mb-12">What Our Users Are Saying</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { name: "Emily Johnson", role: "Event Planner", quote: "EVENTMANAGER has revolutionized how I handle events. The registration process is incredibly smooth, and the analytics tools provide invaluable insights." },
//               { name: "Michael Torres", role: "Conference Organizer", quote: "The advanced features offered by EVENTMANAGER allowed us to scale our annual conference effortlessly. Attendee feedback was overwhelmingly positive." },
//               { name: "Sarah Lee", role: "Attendee", quote: "I was amazed at how easy it was to find and register for events that matched my interests. The user-friendly interface made everything straightforward!" },
//             ].map((testimonial, index) => (
//               <Card key={index} className="bg-white/10 backdrop-blur-lg">
//                 <CardHeader>
//                   <Star className="w-8 h-8 text-yellow-400" />
//                 </CardHeader>
//                 <CardContent>
//                   <p className="mb-4 italic">"{testimonial.quote}"</p>
//                 </CardContent>
//                 <CardFooter>
//                   <div>
//                     <p className="font-semibold">{testimonial.name}</p>
//                     <p className="text-sm">{testimonial.role}</p>
//                   </div>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </section>

//         <section id="about" className="py-16">
//           <Card className="bg-white/10 backdrop-blur-lg">
//             <CardHeader>
//               <CardTitle className="text-3xl font-bold text-center">Who We Are</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-center max-w-2xl mx-auto">
//                 At EVENTMANAGER, we believe in making event planning and participation as effortless as possible. Our dedicated team of developers and event professionals has worked tirelessly to craft a platform that meets the needs of both organizers and attendees. With cutting-edge technology at our fingertips, our mission is to create memorable, engaging events that bring people together.
//               </p>
//             </CardContent>
//           </Card>
//         </section>

//         <section className="py-16 text-center">
//           <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Event Experience?</h2>
//           <p className="mb-8">Whether you're an organizer looking for efficient tools or an attendee eager to explore exciting activities, EVENTMANAGER is here for you.</p>
//           <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100">
//             Join Us Today
//             <ArrowRight className="ml-2 w-4 h-4" />
//           </Button>
//         </section>
//       </main>

//       <footer className="bg-indigo-900 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-wrap justify-between">
//             <div className="w-full md:w-1/3 mb-8 md:mb-0">
//               <h3 className="text-xl font-semibold mb-4">EVENTMANAGER</h3>
//               <p>Transforming the event landscape, one experience at a time.</p>
//             </div>
//             <div className="w-full md:w-1/3 mb-8 md:mb-0">
//               <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="hover:underline">Contact Us</a></li>
//                 <li><a href="#" className="hover:underline">Terms of Service</a></li>
//                 <li><a href="#" className="hover:underline">Privacy Policy</a></li>
//               </ul>
//             </div>
//             <div className="w-full md:w-1/3">
//               <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
//               <div className="flex space-x-4">
//                 <a href="#" className="hover:text-indigo-300"><span className="sr-only">Facebook</span>F</a>
//                 <a href="#" className="hover:text-indigo-300"><span className="sr-only">Twitter</span>T</a>
//                 <a href="#" className="hover:text-indigo-300"><span className="sr-only">LinkedIn</span>L</a>
//                 <a href="#" className="hover:text-indigo-300"><span className="sr-only">Instagram</span>I</a>
//               </div>
//               <p className="mt-4">support@eventmanager.com</p>
//               <p>1-800-555-0199</p>
//             </div>
//           </div>
//           <div className="mt-8 text-center text-sm">
//             © 2024 EVENTMANAGER. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
