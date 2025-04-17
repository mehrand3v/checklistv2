import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardCheck, Store, FileText } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Store Inspection System
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Streamline your store inspections with our comprehensive digital checklist system
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl border border-blue-100/50 dark:border-blue-900/50 bg-white/50 dark:bg-slate-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-lg bg-blue-100/50 dark:bg-blue-900/50 p-3">
                    <ClipboardCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Digital Checklists</h3>
                  <p className="text-muted-foreground">
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
              <div className="relative overflow-hidden rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 bg-white/50 dark:bg-slate-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-lg bg-indigo-100/50 dark:bg-indigo-900/50 p-3">
                    <Store className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Store Management</h3>
                  <p className="text-muted-foreground">
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
              <div className="relative overflow-hidden rounded-xl border border-purple-100/50 dark:border-purple-900/50 bg-white/50 dark:bg-slate-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-lg bg-purple-100/50 dark:bg-purple-900/50 p-3">
                    <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Reports & Analytics</h3>
                  <p className="text-muted-foreground">
                    Generate detailed reports and track inspection performance
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-lg">
                <Link to="/store-info">
                  Start Inspection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg">
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
