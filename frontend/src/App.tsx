import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { applicationApi, interviewApi, reportApi } from './api';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { JobListingPage } from './pages/public/JobListingPage';
import { JobDetailPage } from './pages/public/JobDetailPage';
import { CulturePage } from './pages/public/CulturePage';
import { ApplyModal } from './components/candidate/ApplyModal';

// Candidate Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ApplicationTrackingPage } from './pages/candidate/ApplicationTrackingPage';
import { CandidateProfilePage } from './pages/candidate/CandidateProfilePage';
import { CandidateInterviewsPage } from './pages/candidate/CandidateInterviewsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminKanbanPage } from './pages/admin/AdminKanbanPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminCandidatesPage } from './pages/admin/AdminCandidatesPage';
import { AdminInterviewsPage } from './pages/admin/AdminInterviewsPage';
import { AdminEmployeesPage } from './pages/admin/AdminEmployeesPage';

// Data & Types
import { mockApplications, mockInterviews, mockDashboardStats, mockJobs } from './data/mockData';
import { Job, Application, Interview, ApplicationStatus, InterviewEvaluation } from './types';

const MainApp: React.FC = () => {
  const { activePortal, setActivePortal, currentUser, isBackendOnline } = useAuth();
  
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedJob, setSelectedJob] = useState<Job>(mockJobs[0]);
  const [selectedApp, setSelectedApp] = useState<Application>(mockApplications[0]);

  // Master State for Applications & Interviews
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job>(mockJobs[0]);

  // Sync with real backend when online
  useEffect(() => {
    if (isBackendOnline) {
      applicationApi.getAdminApplications({ size: 100 })
        .then(res => {
          if (res && res.content && res.content.length > 0) {
            setApplications(res.content);
          }
        })
        .catch(err => console.warn('Could not fetch real applications:', err));

      interviewApi.getAdminInterviews()
        .then(res => {
          if (res && res.length > 0) {
            setInterviews(res);
          }
        })
        .catch(err => console.warn('Could not fetch real interviews:', err));
    }
  }, [isBackendOnline]);

  // Dynamic Dashboard Stats calculation
  const stats = {
    ...mockDashboardStats,
    totalApplications: applications.length,
    totalInterviews: interviews.length,
    statusBreakdown: {
      APPLIED: applications.filter(a => a.currentStatus === 'APPLIED').length,
      SCREENING: applications.filter(a => a.currentStatus === 'SCREENING').length,
      INTERVIEW: applications.filter(a => a.currentStatus === 'INTERVIEW').length,
      ASSESSMENT: applications.filter(a => a.currentStatus === 'ASSESSMENT').length,
      OFFER: applications.filter(a => a.currentStatus === 'OFFER').length,
      HIRED: applications.filter(a => a.currentStatus === 'HIRED').length,
      REJECTED: applications.filter(a => a.currentStatus === 'REJECTED').length,
      WITHDRAWN: applications.filter(a => a.currentStatus === 'WITHDRAWN').length,
    }
  };

  const handleOpenApplyModal = (job: Job) => {
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleApplySuccess = (newApp: Application) => {
    setApplications([newApp, ...applications]);
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentTab('job-detail');
  };

  const handleViewTracking = (app: Application) => {
    setSelectedApp(app);
    setCurrentTab('candidate-tracking');
  };

  const handleUpdateAppStatus = async (appId: number, toStatus: ApplicationStatus, reason?: string) => {
    if (isBackendOnline) {
      try {
        await applicationApi.updateStatus(appId, {
          toStatus,
          rejectionReason: reason,
        });
      } catch (e) {
        console.warn('Real API status update failed:', e);
      }
    }

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          currentStatus: toStatus,
          rejectionReason: reason || a.rejectionReason,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return a;
    }));
  };

  const handleAddInterview = async (newInv: Interview) => {
    if (isBackendOnline) {
      try {
        const saved = await interviewApi.scheduleInterview({
          applicationId: newInv.applicationId,
          interviewerId: 4,
          scheduledAt: newInv.scheduledAt,
          durationMinutes: newInv.durationMinutes,
          interviewType: newInv.interviewType,
          locationOrLink: newInv.locationOrLink,
          notes: newInv.notes,
        });
        setInterviews([saved, ...interviews]);
        return;
      } catch (e) {
        console.warn('Real API interview schedule failed:', e);
      }
    }
    setInterviews([newInv, ...interviews]);
  };

  const handleSaveEvaluation = async (interviewId: number, evaluation: InterviewEvaluation) => {
    if (isBackendOnline) {
      try {
        await interviewApi.evaluateInterview(interviewId, {
          technicalScore: evaluation.technicalScore,
          communicationScore: evaluation.communicationScore,
          problemSolvingScore: evaluation.problemSolvingScore,
          teamworkScore: evaluation.teamworkScore,
          generalNotes: evaluation.generalNotes,
          result: evaluation.result,
        });
      } catch (e) {
        console.warn('Real API save evaluation failed:', e);
      }
    }

    setInterviews(prev => prev.map(inv => {
      if (inv.id === interviewId) {
        return {
          ...inv,
          status: 'COMPLETED',
          evaluation
        };
      }
      return inv;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Smart Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PUBLIC PORTAL VIEWS */}
        {activePortal === 'PUBLIC' && (
          <>
            {currentTab === 'home' && (
              <HomePage
                onSelectJob={handleSelectJob}
                onNavigateJobs={(params) => setCurrentTab('jobs')}
                onApplyClick={handleOpenApplyModal}
              />
            )}

            {currentTab === 'jobs' && (
              <JobListingPage
                onSelectJob={handleSelectJob}
                onApplyClick={handleOpenApplyModal}
              />
            )}

            {currentTab === 'job-detail' && (
              <JobDetailPage
                job={selectedJob}
                onBack={() => setCurrentTab('jobs')}
                onApplyClick={handleOpenApplyModal}
                onSelectSimilarJob={handleSelectJob}
              />
            )}

            {currentTab === 'culture' && (
              <CulturePage />
            )}
          </>
        )}

        {/* CANDIDATE PORTAL VIEWS */}
        {activePortal === 'CANDIDATE' && (
          <>
            {currentTab === 'candidate-dashboard' && (
              <CandidateDashboard
                applications={applications}
                interviews={interviews}
                onViewTracking={handleViewTracking}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'candidate-applications' && (
              <CandidateDashboard
                applications={applications}
                interviews={interviews}
                onViewTracking={handleViewTracking}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'candidate-tracking' && (
              <ApplicationTrackingPage
                application={selectedApp}
                onBack={() => setCurrentTab('candidate-dashboard')}
              />
            )}

            {currentTab === 'candidate-profile' && (
              <CandidateProfilePage />
            )}

            {currentTab === 'candidate-interviews' && (
              <CandidateInterviewsPage interviews={interviews} />
            )}

            {currentTab === 'jobs' && (
              <JobListingPage
                onSelectJob={handleSelectJob}
                onApplyClick={handleOpenApplyModal}
              />
            )}

            {currentTab === 'job-detail' && (
              <JobDetailPage
                job={selectedJob}
                onBack={() => setCurrentTab('jobs')}
                onApplyClick={handleOpenApplyModal}
                onSelectSimilarJob={handleSelectJob}
              />
            )}
          </>
        )}

        {/* ADMIN / ATS PORTAL VIEWS */}
        {activePortal === 'ADMIN' && (
          <>
            {currentTab === 'admin-dashboard' && (
              <AdminDashboardPage
                stats={stats}
                recentApplications={applications}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'admin-pipeline' && (
              <AdminKanbanPage
                applications={applications}
                onUpdateStatus={handleUpdateAppStatus}
              />
            )}

            {currentTab === 'admin-jobs' && (
              <AdminJobsPage />
            )}

            {currentTab === 'admin-candidates' && (
              <AdminCandidatesPage applications={applications} />
            )}

            {currentTab === 'admin-interviews' && (
              <AdminInterviewsPage
                interviews={interviews}
                applications={applications}
                onAddInterview={handleAddInterview}
                onSaveEvaluation={handleSaveEvaluation}
              />
            )}

            {currentTab === 'admin-employees' && (
              <AdminEmployeesPage />
            )}
          </>
        )}
      </main>

      {/* Global Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal
          job={jobToApply}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmitSuccess={handleApplySuccess}
          existingApplications={applications}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;

