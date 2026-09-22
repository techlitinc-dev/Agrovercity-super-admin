import React, { useState, useEffect, useCallback } from 'react'
import {
  getContentSummary,
  listAgriNews,
  createAgriNews,
  updateAgriNews,
  deleteAgriNews,
  listAgriChannels,
  createAgriChannel,
  updateAgriChannel,
  regenerateStreamKey,
  listChannelChatMessages,
  deleteChatMessage,
  banChatUser,
  listWorkshops,
  createWorkshop,
  updateWorkshop,
  cancelWorkshop,
  getWorkshopRoster,
  issueWorkshopCertificate,
  refundWorkshopEnrollment,
  listExpertTalks,
  createExpertTalk,
  updateExpertTalk,
  triageFarmerQuestion,
  listVideoGuides,
  createVideoGuide,
  updateVideoGuide,
  deleteVideoGuide,
  listBlogArticles,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
  getContentAuditLogs
} from '../api/contentApi'
import {
  ContentMetricBar,
  ContentTabSwitch,
  ContentFiltersBar,
  AgriNewsTable,
  AgriChannelsTable,
  WorkshopsTable,
  ExpertTalksTable,
  VideoGuidesTable,
  BlogArticlesTable,
  ContentAuditLogsTable,
  ContentPagination
} from './contentWidgets'
import ContentDetailDrawer from '../components/content/ContentDetailDrawer'
import {
  AuditReasonConfirmationModal,
  DualSignOffModal,
  CreateEditNewsModal,
  ManageChannelModal,
  ChannelChatModerationModal,
  CreateEditWorkshopModal,
  WorkshopRosterModal,
  ScheduleExpertTalkModal,
  TriageQuestionsModal,
  CreateEditVideoGuideModal,
  CreateEditBlogModal
} from '../components/content/ContentModals'
import { useNotification } from '../context/NotificationContext'
import { useAuthAdmin } from '../context/AuthAdminContext'

const PAGE_SIZE = 20

const fmtINR = (v) => '₹' + Number(v || 0).toLocaleString('en-IN')

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const head = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object')
  const lines = rows.map((r) =>
    head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  return [head.join(','), ...lines].join('\n')
}

function downloadBlob(content, filename, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ContentPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin, hasPermission } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' }, hasPermission: () => true }

  const [activeTab, setActiveTab] = useState('news') // 'news', 'channels', 'workshops', 'talks', 'videos', 'blogs', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [newsModal, setNewsModal] = useState({ open: false, item: null })
  const [channelModal, setChannelModal] = useState({ open: false, channel: null })
  const [chatModal, setChatModal] = useState({ open: false, channel: null })
  const [workshopModal, setWorkshopModal] = useState({ open: false, item: null })
  const [rosterModal, setRosterModal] = useState({ open: false, workshop: null, roster: [] })
  const [talkModal, setTalkModal] = useState({ open: false, item: null })
  const [triageModal, setTriageModal] = useState({ open: false, talk: null })
  const [videoModal, setVideoModal] = useState({ open: false, item: null })
  const [blogModal, setBlogModal] = useState({ open: false, item: null })

  // Reason Confirmation & Dual Sign-off
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'rose',
    onConfirm: null
  })
  const [dualSignOffDialog, setDualSignOffDialog] = useState({
    open: false,
    title: '',
    amount: 0,
    details: '',
    onConfirm: null
  })

  // 1. Load Summary
  const loadSummary = useCallback(async () => {
    try {
      const s = await getContentSummary()
      setSummary(s)
    } catch (err) {
      console.warn('Failed to load content summary:', err)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  // Reset page and filters on tab switch
  const handleTabSelect = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setLanguageFilter('all')
  }

  // 2. Fetch Data for Active Tab
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      if (activeTab === 'news') {
        res = await listAgriNews({
          q: search,
          status: statusFilter,
          category: categoryFilter,
          language: languageFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'channels') {
        res = await listAgriChannels({
          q: search,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'workshops') {
        res = await listWorkshops({
          q: search,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'talks') {
        res = await listExpertTalks({
          q: search,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'videos') {
        res = await listVideoGuides({
          q: search,
          status: statusFilter,
          category: categoryFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'blogs') {
        res = await listBlogArticles({
          q: search,
          status: statusFilter,
          category: categoryFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'audit') {
        res = await getContentAuditLogs({
          q: search,
          actionType: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      }
      setTableData(res)
    } catch (err) {
      addToast({
        title: 'Data Load Error',
        message: err.message || 'Failed to fetch content records.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, statusFilter, categoryFilter, languageFilter, page, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Handlers for Drawer
  const handleOpenDrawer = (entity) => {
    setSelectedEntity(entity)
    setDrawerOpen(true)
  }

  // Export CSV
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast({
        title: 'Export Failed',
        message: 'No records available to export.',
        type: 'warning'
      })
      return
    }
    const csv = toCsv(tableData.data)
    downloadBlob(csv, `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`)
    addToast({
      title: 'CSV Export Generated',
      message: `Exported ${tableData.data.length} records for ${activeTab}.`,
      type: 'success'
    })
  }

  // -------------------------------------------------------------
  // NEWS ACTIONS
  // -------------------------------------------------------------
  const handleSaveNews = async (formData) => {
    try {
      if (newsModal.item) {
        await updateAgriNews(newsModal.item.id, formData)
        addToast({ title: 'Article Updated', message: 'Agricultural news article updated successfully.', type: 'success' })
      } else {
        await createAgriNews(formData)
        addToast({ title: 'Article Published', message: 'New agricultural news article published to knowledge hub.', type: 'success' })
      }
      setNewsModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Operation Failed', message: err.message, type: 'error' })
    }
  }

  const handleDeleteNews = (item) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Agricultural News Article',
      message: `Are you sure you want to delete "${item.title}"? This action will remove the article and vernacular audio narration from mobile feeds.`,
      confirmLabel: 'Delete Article',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await deleteAgriNews(item.id, reason)
          addToast({ title: 'Article Deleted', message: `Article ${item.id} removed from feed.`, type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // CHANNEL ACTIONS
  // -------------------------------------------------------------
  const handleSaveChannel = async (formData) => {
    try {
      if (channelModal.channel) {
        await updateAgriChannel(channelModal.channel.id, formData)
        addToast({ title: 'Channel Updated', message: 'Broadcast channel parameters saved.', type: 'success' })
      } else {
        await createAgriChannel(formData)
        addToast({ title: 'Channel Added', message: 'New broadcast live channel registered.', type: 'success' })
      }
      setChannelModal({ open: false, channel: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Channel Error', message: err.message, type: 'error' })
    }
  }

  const handleRegenerateKey = (channel) => {
    setConfirmDialog({
      open: true,
      title: 'Regenerate RTMP Stream Key',
      message: `Regenerating the stream key for "${channel.channelName}" will immediately terminate any active uplink broadcast encoder session.`,
      confirmLabel: 'Regenerate Key',
      confirmVariant: 'amber',
      onConfirm: async (reason) => {
        try {
          const res = await regenerateStreamKey(channel.id, reason)
          addToast({
            title: 'Stream Key Regenerated',
            message: `New secret ingest key issued: ${res.streamKey.slice(0, 12)}••••`,
            type: 'success'
          })
          setConfirmDialog({ open: false })
          setChannelModal({ open: false, channel: null })
          loadData()
        } catch (err) {
          addToast({ title: 'Key Rotation Error', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleDeleteChatMessage = (channelId, messageId) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Live Chat Message',
      message: 'Remove this message permanently from the live stream chat window?',
      confirmLabel: 'Delete Message',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await deleteChatMessage(channelId, messageId, reason)
          addToast({ title: 'Message Removed', message: 'Inappropriate message pruned from chat.', type: 'success' })
          setConfirmDialog({ open: false })
          // Update chat modal local state
          if (chatModal.channel) {
            const updatedMsgs = await listChannelChatMessages(channelId)
            setChatModal((prev) => ({
              ...prev,
              channel: { ...prev.channel, chatMessages: updatedMsgs }
            }))
          }
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Action Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleBanChatUser = (channelId, userId, userName) => {
    setConfirmDialog({
      open: true,
      title: `Ban User from Live Chat: ${userName}`,
      message: `User UID: ${userId} will be blocked from sending messages across all live TV channels. All existing messages will be retracted.`,
      confirmLabel: 'Enforce Ban',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await banChatUser(channelId, userId, reason, 'permanent')
          addToast({
            title: 'User Banned',
            message: `${userName} permanently banned from live chat per IT moderation rules.`,
            type: 'success'
          })
          setConfirmDialog({ open: false })
          if (chatModal.channel) {
            const updatedMsgs = await listChannelChatMessages(channelId)
            setChatModal((prev) => ({
              ...prev,
              channel: { ...prev.channel, chatMessages: updatedMsgs }
            }))
          }
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Ban Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // WORKSHOP ACTIONS
  // -------------------------------------------------------------
  const handleSaveWorkshop = async (formData) => {
    try {
      if (workshopModal.item) {
        await updateWorkshop(workshopModal.item.id, formData)
        addToast({ title: 'Workshop Updated', message: 'ICAR workshop curriculum & date updated.', type: 'success' })
      } else {
        await createWorkshop(formData)
        addToast({ title: 'Workshop Created', message: 'New ICAR accredited workshop registered.', type: 'success' })
      }
      setWorkshopModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Workshop Error', message: err.message, type: 'error' })
    }
  }

  const handleOpenRoster = async (workshop) => {
    try {
      const rosterData = await getWorkshopRoster(workshop.id)
      setRosterModal({ open: true, workshop, roster: rosterData })
    } catch (err) {
      addToast({ title: 'Roster Error', message: err.message, type: 'error' })
    }
  }

  const handleIssueCert = async (workshopId, farmerId) => {
    try {
      await issueWorkshopCertificate(workshopId, farmerId)
      addToast({ title: 'Certificate Dispatched', message: 'ICAR accredited certificate generated and sent to farmer.', type: 'success' })
      const updatedRoster = await getWorkshopRoster(workshopId)
      setRosterModal((prev) => ({ ...prev, roster: updatedRoster }))
      loadData()
    } catch (err) {
      addToast({ title: 'Certificate Error', message: err.message, type: 'error' })
    }
  }

  const handleRefundRosterFarmer = (workshopId, farmerItem) => {
    const refundAmount = farmerItem.amountPaidINR || 0
    // Check dual sign off limit (> ₹50,000)
    if (refundAmount > 50000) {
      setDualSignOffDialog({
        open: true,
        title: 'Dual Sign-Off: High-Value Enrollment Refund',
        amount: refundAmount,
        details: `Farmer: ${farmerItem.farmerName} • Workshop ID: ${workshopId}`,
        onConfirm: async ({ secondAdminEmail, reason }) => {
          try {
            await refundWorkshopEnrollment(workshopId, farmerItem.farmerId, reason, secondAdminEmail)
            addToast({ title: 'Refund Dispatched', message: `₹${refundAmount} refunded with dual sign-off.`, type: 'success' })
            setDualSignOffDialog({ open: false })
            const updatedRoster = await getWorkshopRoster(workshopId)
            setRosterModal((prev) => ({ ...prev, roster: updatedRoster }))
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Refund Failed', message: err.message, type: 'error' })
          }
        }
      })
    } else {
      setConfirmDialog({
        open: true,
        title: 'Refund Workshop Enrollment Fee',
        message: `Issue refund of ${fmtINR(refundAmount)} to ${farmerItem.farmerName}?`,
        confirmLabel: 'Issue Refund',
        confirmVariant: 'rose',
        onConfirm: async (reason) => {
          try {
            await refundWorkshopEnrollment(workshopId, farmerItem.farmerId, reason)
            addToast({ title: 'Fee Refunded', message: `₹${refundAmount} refunded to farmer's original payment method.`, type: 'success' })
            setConfirmDialog({ open: false })
            const updatedRoster = await getWorkshopRoster(workshopId)
            setRosterModal((prev) => ({ ...prev, roster: updatedRoster }))
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Refund Error', message: err.message, type: 'error' })
          }
        }
      })
    }
  }

  const handleCancelWorkshop = (workshop) => {
    const totalLiabilities = (workshop.enrolledCount || 0) * (workshop.feeINR || 0)
    if (totalLiabilities > 50000) {
      setDualSignOffDialog({
        open: true,
        title: 'Dual Sign-Off: Workshop Cancellation & Mass Refund',
        amount: totalLiabilities,
        details: `Batch "${workshop.title}" has ${workshop.enrolledCount} enrolled participants totaling ${fmtINR(totalLiabilities)} in escrow refunds.`,
        onConfirm: async ({ secondAdminEmail, reason }) => {
          try {
            await cancelWorkshop(workshop.id, reason, secondAdminEmail)
            addToast({ title: 'Workshop Cancelled', message: 'Mass refund triggered with dual sign-off authorization.', type: 'success' })
            setDualSignOffDialog({ open: false })
            setDrawerOpen(false)
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Cancellation Error', message: err.message, type: 'error' })
          }
        }
      })
    } else {
      setConfirmDialog({
        open: true,
        title: 'Cancel ICAR Workshop',
        message: `Are you sure you want to cancel "${workshop.title}"? All enrolled farmers will receive full escrow refunds.`,
        confirmLabel: 'Cancel Workshop',
        confirmVariant: 'rose',
        onConfirm: async (reason) => {
          try {
            await cancelWorkshop(workshop.id, reason)
            addToast({ title: 'Workshop Cancelled', message: 'Workshop cancelled and refunds processed.', type: 'success' })
            setConfirmDialog({ open: false })
            setDrawerOpen(false)
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Cancellation Error', message: err.message, type: 'error' })
          }
        }
      })
    }
  }

  // -------------------------------------------------------------
  // EXPERT TALK ACTIONS
  // -------------------------------------------------------------
  const handleSaveTalk = async (formData) => {
    try {
      if (talkModal.item) {
        await updateExpertTalk(talkModal.item.id, formData)
        addToast({ title: 'Talk Updated', message: 'Scientist talk schedule updated.', type: 'success' })
      } else {
        await createExpertTalk(formData)
        addToast({ title: 'Talk Scheduled', message: 'Ask-the-Scientist session scheduled.', type: 'success' })
      }
      setTalkModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'error' })
    }
  }

  const handleTriageQuestionAction = async (talkId, questionId, status, priority, reason) => {
    try {
      await triageFarmerQuestion(talkId, questionId, status, priority, reason)
      addToast({ title: 'Question Triaged', message: `Farmer question status updated to ${status}.`, type: 'success' })
      // Update local state
      const updatedTalks = await listExpertTalks({ page, pageSize: PAGE_SIZE })
      const updatedTalk = updatedTalks.data.find((t) => t.id === talkId)
      if (updatedTalk) {
        setTriageModal({ open: true, talk: updatedTalk })
      }
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Triage Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // VIDEO GUIDE & BLOG ACTIONS
  // -------------------------------------------------------------
  const handleSaveVideo = async (formData) => {
    try {
      if (videoModal.item) {
        await updateVideoGuide(videoModal.item.id, formData)
        addToast({ title: 'Video Updated', message: 'Video guide saved.', type: 'success' })
      } else {
        await createVideoGuide(formData)
        addToast({ title: 'Video Published', message: 'Agronomy tutorial published with multilingual support.', type: 'success' })
      }
      setVideoModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Video Error', message: err.message, type: 'error' })
    }
  }

  const handleDeleteVideo = (item) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Video Guide',
      message: `Delete video tutorial "${item.title}"?`,
      confirmLabel: 'Delete Video',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await deleteVideoGuide(item.id, reason)
          addToast({ title: 'Video Removed', message: 'Tutorial removed from library.', type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleSaveBlog = async (formData) => {
    try {
      if (blogModal.item) {
        await updateBlogArticle(blogModal.item.id, formData)
        addToast({ title: 'Blog Updated', message: 'Agronomy blog article updated.', type: 'success' })
      } else {
        await createBlogArticle(formData)
        addToast({ title: 'Blog Published', message: 'New agronomy article published.', type: 'success' })
      }
      setBlogModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Blog Error', message: err.message, type: 'error' })
    }
  }

  const handleDeleteBlog = (item) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Blog Article',
      message: `Delete article "${item.title}"?`,
      confirmLabel: 'Delete Blog',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await deleteBlogArticle(item.id, reason)
          addToast({ title: 'Article Deleted', message: 'Blog removed from knowledge base.', type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // Determine create action handler based on active tab
  const handleCreateNew = () => {
    if (activeTab === 'news') setNewsModal({ open: true, item: null })
    else if (activeTab === 'channels') setChannelModal({ open: true, channel: null })
    else if (activeTab === 'workshops') setWorkshopModal({ open: true, item: null })
    else if (activeTab === 'talks') setTalkModal({ open: true, item: null })
    else if (activeTab === 'videos') setVideoModal({ open: true, item: null })
    else if (activeTab === 'blogs') setBlogModal({ open: true, item: null })
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Top Metric Bar */}
      <ContentMetricBar summary={summary} loading={!summary} />

      {/* Primary Section */}
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
        {/* Module Tab Switcher */}
        <ContentTabSwitch
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          counts={{
            news: summary?.totalNewsArticles,
            channels: summary?.liveChannelsCount,
            workshops: summary?.activeWorkshops,
            talks: summary?.expertTalksScheduled,
            videos: summary?.videoGuidesPublished,
            blogs: summary?.blogArticlesPublished
          }}
        />

        {/* Search & Filter Bar */}
        <ContentFiltersBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          language={languageFilter}
          onLanguageChange={setLanguageFilter}
          activeTab={activeTab}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
          onCreateNew={handleCreateNew}
          canCreate={hasPermission('canUpdateStatus') || hasPermission('canDelete')}
        />

        {/* Primary Data Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mr-2" />
            Loading {activeTab} data records...
          </div>
        ) : (
          <>
            {activeTab === 'news' && (
              <AgriNewsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={(item) => setNewsModal({ open: true, item })}
                onDelete={handleDeleteNews}
              />
            )}

            {activeTab === 'channels' && (
              <AgriChannelsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onManageKeys={(chan) => setChannelModal({ open: true, channel: chan })}
                onModerateChat={(chan) => setChatModal({ open: true, channel: chan })}
                onToggleStatus={(chan) => setChannelModal({ open: true, channel: chan })}
              />
            )}

            {activeTab === 'workshops' && (
              <WorkshopsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onRoster={handleOpenRoster}
                onEdit={(ws) => setWorkshopModal({ open: true, item: ws })}
                onCancel={handleCancelWorkshop}
              />
            )}

            {activeTab === 'talks' && (
              <ExpertTalksTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onTriage={(talk) => setTriageModal({ open: true, talk })}
                onEdit={(talk) => setTalkModal({ open: true, item: talk })}
              />
            )}

            {activeTab === 'videos' && (
              <VideoGuidesTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={(vid) => setVideoModal({ open: true, item: vid })}
                onDelete={handleDeleteVideo}
              />
            )}

            {activeTab === 'blogs' && (
              <BlogArticlesTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={(blog) => setBlogModal({ open: true, item: blog })}
                onDelete={handleDeleteBlog}
              />
            )}

            {activeTab === 'audit' && (
              <ContentAuditLogsTable data={tableData.data} />
            )}

            {/* Pagination Controls */}
            <ContentPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={tableData.total || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <ContentDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        onClose={() => setDrawerOpen(false)}
        onEdit={(item) => {
          if (activeTab === 'news') setNewsModal({ open: true, item })
          else if (activeTab === 'channels') setChannelModal({ open: true, channel: item })
          else if (activeTab === 'workshops') setWorkshopModal({ open: true, item })
          else if (activeTab === 'talks') setTalkModal({ open: true, item })
          else if (activeTab === 'videos') setVideoModal({ open: true, item })
          else if (activeTab === 'blogs') setBlogModal({ open: true, item })
        }}
        onDelete={(item) => {
          if (activeTab === 'news') handleDeleteNews(item)
          else if (activeTab === 'videos') handleDeleteVideo(item)
          else if (activeTab === 'blogs') handleDeleteBlog(item)
        }}
        onManageKeys={(chan) => setChannelModal({ open: true, channel: chan })}
        onModerateChat={(chan) => setChatModal({ open: true, channel: chan })}
        onRoster={(ws) => handleOpenRoster(ws)}
        onTriage={(talk) => setTriageModal({ open: true, talk })}
      />

      {/* Action Modals */}
      <CreateEditNewsModal
        isOpen={newsModal.open}
        initialData={newsModal.item}
        onClose={() => setNewsModal({ open: false, item: null })}
        onSave={handleSaveNews}
      />

      <ManageChannelModal
        isOpen={channelModal.open}
        channel={channelModal.channel}
        onClose={() => setChannelModal({ open: false, channel: null })}
        onSave={handleSaveChannel}
        onRegenerateKey={handleRegenerateKey}
      />

      <ChannelChatModerationModal
        isOpen={chatModal.open}
        channel={chatModal.channel}
        onClose={() => setChatModal({ open: false, channel: null })}
        onDeleteMessage={handleDeleteChatMessage}
        onBanUser={handleBanChatUser}
      />

      <CreateEditWorkshopModal
        isOpen={workshopModal.open}
        initialData={workshopModal.item}
        onClose={() => setWorkshopModal({ open: false, item: null })}
        onSave={handleSaveWorkshop}
      />

      <WorkshopRosterModal
        isOpen={rosterModal.open}
        workshop={rosterModal.workshop}
        roster={rosterModal.roster}
        onClose={() => setRosterModal({ open: false, workshop: null, roster: [] })}
        onIssueCertificate={handleIssueCert}
        onRefund={handleRefundRosterFarmer}
      />

      <ScheduleExpertTalkModal
        isOpen={talkModal.open}
        initialData={talkModal.item}
        onClose={() => setTalkModal({ open: false, item: null })}
        onSave={handleSaveTalk}
      />

      <TriageQuestionsModal
        isOpen={triageModal.open}
        talk={triageModal.talk}
        onClose={() => setTriageModal({ open: false, talk: null })}
        onTriageQuestion={handleTriageQuestionAction}
      />

      <CreateEditVideoGuideModal
        isOpen={videoModal.open}
        initialData={videoModal.item}
        onClose={() => setVideoModal({ open: false, item: null })}
        onSave={handleSaveVideo}
      />

      <CreateEditBlogModal
        isOpen={blogModal.open}
        initialData={blogModal.item}
        onClose={() => setBlogModal({ open: false, item: null })}
        onSave={handleSaveBlog}
      />

      <AuditReasonConfirmationModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
      />

      <DualSignOffModal
        isOpen={dualSignOffDialog.open}
        title={dualSignOffDialog.title}
        amount={dualSignOffDialog.amount}
        details={dualSignOffDialog.details}
        onClose={() => setDualSignOffDialog({ open: false })}
        onConfirm={dualSignOffDialog.onConfirm || (() => {})}
      />
    </div>
  )
}
