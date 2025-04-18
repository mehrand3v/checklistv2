import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardCheck, Store, FileText } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div 
        className="container max-w-6xl mx-auto px-4 py-8"
        style={{
          backgroundColor: "#e5e5f7",
          opacity: 0.8,
          backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
          backgroundSize: "10px 10px"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Store Inspection System
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Streamline your store inspections with our comprehensive digital checklist system
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl border border-blue-100/50 dark:border-blue-900/50 bg-white/50 dark:bg-slate-900/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-3 inline-block rounded-lg bg-blue-100/50 dark:bg-blue-900/50 p-2">
                    <ClipboardCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Digital Checklists</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage custom inspection checklists for your stores
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 bg-white/50 dark:bg-slate-900/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-3 inline-block rounded-lg bg-indigo-100/50 dark:bg-indigo-900/50 p-2">
                    <Store className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Store Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Track and manage store information and inspection history
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl border border-purple-100/50 dark:border-purple-900/50 bg-white/50 dark:bg-slate-900/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-3 inline-block rounded-lg bg-purple-100/50 dark:bg-purple-900/50 p-2">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Reports & Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate detailed reports and track inspection performance
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link to="/store-info">
                  Start Inspection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6 text-base">
                <Link to="/admin">
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
