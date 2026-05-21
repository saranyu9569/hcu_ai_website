"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  ExternalLink,
  Download,
  Clock,
  X,
} from "lucide-react";

export default function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample academic timetable data
  const timetableData = [
    {
      time: "08:00-10:00",
      monday: "AI Fundamentals\nRoom: B201",
      tuesday: "Machine Learning\nRoom: B202",
      wednesday: "Data Structures\nRoom: B203",
      thursday: "Programming Lab\nRoom: C101",
      friday: "Research Methods\nRoom: B204",
    },
    {
      time: "10:00-12:00",
      monday: "Statistics\nRoom: B205",
      tuesday: "Neural Networks\nRoom: B206",
      wednesday: "Database Systems\nRoom: B207",
      thursday: "AI Ethics\nRoom: B208",
      friday: "Project Work\nRoom: C102",
    },
    {
      time: "13:00-15:00",
      monday: "Computer Vision\nRoom: C103",
      tuesday: "NLP Processing\nRoom: C104",
      wednesday: "Deep Learning\nRoom: C105",
      thursday: "Robotics\nRoom: C106",
      friday: "Seminar\nRoom: B209",
    },
    {
      time: "15:00-17:00",
      monday: "Lab Practice\nRoom: C107",
      tuesday: "AI Applications\nRoom: C108",
      wednesday: "Research Project\nRoom: C109",
      thursday: "Industry Project\nRoom: C110",
      friday: "Free Period",
    },
  ];

  const AcademicTimetableModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent 
        className="w-[95vw] h-[60vh] max-w-none max-h-none overflow-y-auto"
        style={{ width: '95vw', maxWidth: 'none' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-500" />
            Academic Timetable - AI Program
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Time</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Monday</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Tuesday</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Wednesday</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Thursday</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Friday</th>
                </tr>
              </thead>
              <tbody>
                {timetableData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 p-3 font-medium text-sky-500">
                      {row.time}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="whitespace-pre-line text-sm">
                        {row.monday}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="whitespace-pre-line text-sm">
                        {row.tuesday}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="whitespace-pre-line text-sm">
                        {row.wednesday}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="whitespace-pre-line text-sm">
                        {row.thursday}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="whitespace-pre-line text-sm">
                        {row.friday}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Academic Year: 2024-2025</p>
              <p>Semester: 1</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Print Schedule
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Student Resources</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Access essential resources, academic support, and opportunities to
            enhance your learning experience in the AI program.
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Tabs defaultValue="academic" className="space-y-8">
          <TabsList className="grid w-full max-w-4xl grid-cols-3 bg-gray-100">
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="life">Student Life</TabsTrigger>
          </TabsList>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Academic Resources</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Course Materials
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Access lecture notes, assignments, and supplementary
                      materials for all courses.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer hover:bg-slate-900 hover:text-white"
                      asChild
                    >
                      <a
                        href="/pdf/มคอ.2ai_แผนกหลักสูตรอัพเดต 8 ต.ค. 62.pdf"
                        download
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Course Material
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Calendar className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Academic Calendar
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Important dates, deadlines, and academic schedule
                      information.
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer hover:bg-sky-500 hover:text-white border-teal-600 text-sky-500"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        View Timetable
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Academic Advising
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Get guidance on course selection, academic planning, and
                      career paths.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer  hover:bg-slate-900 hover:text-white"
                    >
                      Schedule Appointment
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Student Folders
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Personal Folder
                    </p>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-slate-900 hover:text-white"
                      asChild
                    >
                      <Link href="">
                        <div className="flex">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Edit Folder
                        </div>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Award className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Grade</h3>
                    <p className="text-muted-foreground mb-4">HCU Grade</p>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-slate-900 hover:text-white"
                    >
                      <Link href="https://reg2.hcu.ac.th/mobile/wp-login.php?redirect_to=/mobile/">
                        <div className="flex">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Grades
                        </div>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Scholarship</h3>
                    <p className="text-muted-foreground mb-4">
                      Scholarship Folder
                    </p>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-slate-900 hover:text-white"
                    >
                      <Link href="">
                        <div className="flex">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Edit Folder
                        </div>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <Link href={"https://reg2.hcu.ac.th/index.php"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">HCU Reg2</h4>
                          <p className="text-sm text-muted-foreground">
                            Grades, registration
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card>
                  <Link href={"https://e-learning.hcu.ac.th/moodle/"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">HCU E-Learning</h4>
                          <p className="text-sm text-muted-foreground">
                            E-Learning
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card>
                  <Link href={"https://graduation.hcu.ac.th/?page_id=8"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            HCU Digital Transcript
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Online Transcript
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card>
                  <Link href={"http://assess.hcu.ac.th/assess/"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            HCU Online Teaching Evaluation
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Teaching Evaluation
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card>
                  <Link href={"https://comonline.hcu.ac.th/EBooking/"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">HCU Library E-Booking</h4>
                          <p className="text-sm text-muted-foreground">
                            Online Library Booking
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card>
                  <Link href={"https://comonline.hcu.ac.th/activity/activity.aspx"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">HCU Student Activity</h4>
                          <p className="text-sm text-muted-foreground">
                            Online Library Booking
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Career Services</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Resume Review
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Professional resume and cover letter review services.
                    </p>
                    <Button variant="outline" className="w-full">
                      Submit Resume
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Job Board</h3>
                    <p className="text-muted-foreground mb-4 pb-6">
                      Job postings from our industry partners.
                    </p>
                    <Button variant="outline" className="w-full">
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-sky-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Alumni Network
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with alumni working in AI and tech industries.
                    </p>
                    <Button variant="outline" className="w-full">
                      Join Network
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Student Life Tab */}
          <TabsContent value="life" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Student Life</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Student Organizations
                  </h3>
                  <div className="space-y-4">

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">HCU Dorm</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Dorm for Student
                        </p>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">HCU MAP</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                         Inside Huachiew Chalermprakiat University
                        </p>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Campus Resources
                  </h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">
                          Student Health Center
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Medical services and mental health support for
                          students.
                        </p>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">AI Facility</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Computer facilities
                        </p>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Academic Timetable Modal */}
      <AcademicTimetableModal />
    </div>
  );
}