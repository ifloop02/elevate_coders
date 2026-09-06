import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

export interface PDFWeekItem {
  weekNumber: number
  dates: string
  curriculum: string
}

export interface WelcomePacketPDFProps {
  studentName: string
  track: string
  levelName?: string
  isLevel2?: boolean
  weeks: PDFWeekItem[]
}

const purple = '#7C3AED'
const darkPurple = '#1E1B4B'
const green = '#059669'
const lightGray = '#F9FAFB'
const gray = '#4B5563'
const border = '#E5E7EB'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
    paddingBottom: 44,
    paddingLeft: 0,
    paddingRight: 0,
  },
  header: {
    backgroundColor: darkPurple,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 36,
    paddingRight: 36,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  headerAccentText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#A78BFA',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 1.4,
  },
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 36,
    paddingRight: 36,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 700,
    color: darkPurple,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 9.5,
    color: gray,
    lineHeight: 1.45,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: darkPurple,
    marginTop: 10,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: border,
    borderBottomStyle: 'solid',
  },
  infoBox: {
    backgroundColor: lightGray,
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: purple,
    borderLeftStyle: 'solid',
  },
  infoBoxTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: purple,
    marginBottom: 2,
  },
  infoBoxText: {
    fontSize: 9,
    color: gray,
    lineHeight: 1.4,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#F5F3FF',
    borderRadius: 6,
    marginBottom: 5,
  },
  weekLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weekBadge: {
    backgroundColor: purple,
    borderRadius: 10,
    paddingTop: 2.5,
    paddingBottom: 2.5,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
    width: 54,
    textAlign: 'center',
  },
  weekText: {
    fontSize: 9.5,
    color: darkPurple,
    fontWeight: 700,
    marginLeft: 10,
  },
  weekDates: {
    fontSize: 9,
    color: gray,
    fontWeight: 700,
    marginLeft: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: purple,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 3.5,
    marginRight: 8,
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: darkPurple,
    marginBottom: 2,
  },
  stepItemText: {
    fontSize: 8.5,
    color: gray,
    lineHeight: 1.4,
    marginBottom: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: border,
    borderTopStyle: 'solid',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
})

export default function WelcomePacketPDF({
  studentName,
  track,
  levelName,
  isLevel2 = false,
  weeks,
}: WelcomePacketPDFProps) {
  return (
    <Document
      title={`Elevate Coders Welcome Packet — ${studentName}`}
      author="Elevate Coders"
      subject="Fall 2026 Welcome Packet"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitleText}>Elevate </Text>
            <Text style={styles.headerAccentText}>Coders</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Fall 2026 Welcome Packet &amp; Setup Guide — {track} Track{levelName ? ` (${levelName})` : ''}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Greeting */}
          <Text style={styles.greeting}>Welcome, {studentName}! 🎉</Text>
          <Text style={styles.paragraph}>
            We&apos;re thrilled to have you joining the Elevate Coders Fall 2026 program!
            Please follow the software setup steps below on the laptop your child will bring to class (Windows or Mac).
          </Text>

          {/* Enrolled weeks */}
          {weeks.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.sectionTitle}>Your Enrolled Sessions ({weeks.length} Total)</Text>
              {weeks.map((w) => (
                <View key={w.weekNumber} style={styles.weekRow}>
                  <View style={styles.weekLeft}>
                    <Text style={styles.weekBadge}>Week {w.weekNumber}</Text>
                    <Text style={styles.weekText}>{w.curriculum}</Text>
                  </View>
                  <Text style={styles.weekDates}>{w.dates}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Step 1 — Install Scratch Desktop */}
          <Text style={styles.sectionTitle}>
            Step 1 — Install Scratch Desktop {isLevel2 ? '(Module Foundations)' : '(Required for All Beginner Sessions)'}
          </Text>
          <Text style={styles.paragraph}>
            Scratch Desktop lets your child create and run Scratch projects offline during class.
          </Text>

          {/* Windows Scratch */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>W</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Windows Installation</Text>
              <Text style={styles.stepItemText}>1. Visit: scratch.mit.edu/download</Text>
              <Text style={styles.stepItemText}>2. Click &quot;Download for Windows&quot; and open the .exe installer</Text>
              <Text style={styles.stepItemText}>3. Follow the installation wizard and launch Scratch from the Desktop</Text>
            </View>
          </View>

          {/* Mac Scratch */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>M</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>macOS Installation</Text>
              <Text style={styles.stepItemText}>1. Visit: scratch.mit.edu/download and click &quot;Download for macOS&quot;</Text>
              <Text style={styles.stepItemText}>2. Open the downloaded .dmg and drag Scratch to your Applications folder</Text>
              <Text style={styles.stepItemText}>3. Launch Scratch Desktop from Applications to verify the cat sprite appears</Text>
            </View>
          </View>

          {/* Step 2 — Install Thonny Python IDE */}
          <Text style={styles.sectionTitle}>
            Step 2 — Install Thonny Python IDE {isLevel2 ? '(Required for Level 2 Class)' : '(Optional — Level 2 only)'}
          </Text>
          <Text style={styles.paragraph}>
            {isLevel2
              ? 'Required for Level 2 Thursday sessions. Thonny is an easy-to-use Python IDE with a built-in interpreter.'
              : 'Only required if enrolled in Level 2 sessions or Python modules. Beginners do not need to install this yet.'}
          </Text>

          {/* Windows Thonny */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>W</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Windows Installation (Thonny)</Text>
              <Text style={styles.stepItemText}>1. Visit: thonny.org and click the Windows download link</Text>
              <Text style={styles.stepItemText}>2. Run the installer and launch Thonny to verify the Python shell starts</Text>
            </View>
          </View>

          {/* Mac Thonny */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>M</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>macOS Installation (Thonny)</Text>
              <Text style={styles.stepItemText}>1. Visit: thonny.org and download the macOS .pkg package</Text>
              <Text style={styles.stepItemText}>2. Run the installer package and launch Thonny from Applications</Text>
            </View>
          </View>

          {/* Checklist */}
          <Text style={styles.sectionTitle}>Checklist for Day 1</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>☐  Laptop with {isLevel2 ? 'Scratch Desktop and Thonny' : 'Scratch Desktop'} installed</Text>
            <Text style={styles.infoBoxText}>☐  Laptop charger / power cable</Text>
            <Text style={styles.infoBoxText}>☐  Water bottle (labeled with student name)</Text>
            <Text style={styles.infoBoxText}>☐  Nut-free snack</Text>
          </View>

          {/* Contact */}
          <View style={[styles.infoBox, { borderLeftColor: green, backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.infoBoxTitle, { color: '#065F46' }]}>Questions? We&apos;re here to help.</Text>
            <Text style={[styles.infoBoxText, { color: '#047857' }]}>
              Email: team.elevate@gwelevate.com | Elevate Coders Academy — 0% Sales Tax (CA Educational Services)
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© 2026 Elevate Coders Academy — Fall Welcome Packet</Text>
          <Text style={styles.footerText}>elevatecoders.com</Text>
        </View>
      </Page>
    </Document>
  )
}
