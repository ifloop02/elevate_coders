import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

interface WelcomePacketPDFProps {
  studentName: string
  track: string
  weeks: { weekNumber: number; dates: string; curriculum: string }[]
}

const purple = '#7C3AED'
const darkPurple = '#1E1B4B'
const green = '#059669'
const lightGray = '#F9FAFB'
const gray = '#4B5563'
const border = '#E5E7EB'

// Clean, explicit numeric styles for @react-pdf/renderer (NO invalid string shorthands)
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
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 36,
    paddingRight: 36,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    fontSize: 12,
    color: '#D1D5DB',
  },
  body: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 36,
    paddingRight: 36,
  },
  greeting: {
    fontSize: 17,
    fontWeight: 700,
    color: darkPurple,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10.5,
    color: gray,
    lineHeight: 1.5,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: darkPurple,
    marginTop: 14,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: border,
    borderBottomStyle: 'solid',
  },
  infoBox: {
    backgroundColor: lightGray,
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: purple,
    borderLeftStyle: 'solid',
  },
  infoBoxTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: purple,
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 10,
    color: gray,
    lineHeight: 1.5,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#F5F3FF',
    borderRadius: 6,
    marginBottom: 6,
  },
  weekBadge: {
    backgroundColor: purple,
    borderRadius: 12,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
    width: 60,
    textAlign: 'center',
  },
  weekText: {
    fontSize: 10,
    color: darkPurple,
    fontWeight: 700,
    flex: 1,
    marginLeft: 10,
  },
  weekDates: {
    fontSize: 9.5,
    color: gray,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: purple,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 4,
    marginRight: 10,
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: darkPurple,
    marginBottom: 4,
  },
  stepItemText: {
    fontSize: 9.5,
    color: gray,
    lineHeight: 1.45,
    marginBottom: 2,
  },
  codeBlock: {
    backgroundColor: '#1E1B4B',
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  code: {
    fontSize: 9.5,
    color: '#A78BFA',
    fontFamily: 'Courier',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: border,
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8.5,
    color: '#9CA3AF',
  },
})

export default function WelcomePacketPDF({ studentName, track, weeks }: WelcomePacketPDFProps) {
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
            Fall 2026 Welcome Packet &amp; Setup Guide — {track} Track
          </Text>
        </View>

        <View style={styles.body}>
          {/* Greeting */}
          <Text style={styles.greeting}>Welcome, {studentName}! 🎉</Text>
          <Text style={styles.paragraph}>
            We&apos;re thrilled to have you joining the Elevate Coders Fall 2026 program!
            This packet contains your setup guide. Please follow the installation steps below
            on the laptop your child will bring to class (Windows or Mac).
          </Text>

          {/* Enrolled weeks */}
          {weeks.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.sectionTitle}>Your Enrolled Sessions</Text>
              {weeks.map((w) => (
                <View key={w.weekNumber} style={styles.weekRow}>
                  <Text style={styles.weekBadge}>Week {w.weekNumber}</Text>
                  <Text style={styles.weekText}>{w.curriculum}</Text>
                  <Text style={styles.weekDates}>{w.dates}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Step 1 — Install Scratch Desktop */}
          <Text style={styles.sectionTitle}>Step 1 — Install Scratch Desktop</Text>
          <Text style={styles.paragraph}>
            Scratch Desktop lets your child create and run Scratch projects offline.
          </Text>

          {/* Windows Scratch */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>W</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Windows Installation</Text>
              <Text style={styles.stepItemText}>1. Go to: scratch.mit.edu/download</Text>
              <Text style={styles.stepItemText}>2. Click &quot;Download for Windows&quot; and save the .exe installer</Text>
              <Text style={styles.stepItemText}>3. Open your Downloads folder and double-click Scratch Desktop Setup.exe</Text>
              <Text style={styles.stepItemText}>4. Follow the install wizard — click Next → Install → Finish</Text>
              <Text style={styles.stepItemText}>5. Look for the Scratch cat icon on your Desktop and double-click to launch</Text>
            </View>
          </View>

          {/* Mac Scratch */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>M</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>macOS Installation</Text>
              <Text style={styles.stepItemText}>1. Go to: scratch.mit.edu/download</Text>
              <Text style={styles.stepItemText}>2. Click &quot;Download for macOS&quot; — a .dmg file will download</Text>
              <Text style={styles.stepItemText}>3. Open the .dmg file from your Downloads folder</Text>
              <Text style={styles.stepItemText}>4. Drag the Scratch Desktop app to your Applications folder</Text>
              <Text style={styles.stepItemText}>5. Open Applications, find Scratch Desktop, and double-click to launch</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>✓ Test: Create a new project in Scratch Desktop</Text>
            <Text style={styles.infoBoxText}>
              When Scratch opens, you should see an orange cat sprite on a white stage. Click the green flag ▶ button to test!
            </Text>
          </View>

          {/* Step 2 — Install Thonny Python IDE */}
          <Text style={styles.sectionTitle}>Step 2 — Install Thonny Python IDE (Level 2)</Text>

          {/* Windows Thonny */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>W</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Windows Installation</Text>
              <Text style={styles.stepItemText}>1. Go to: thonny.org</Text>
              <Text style={styles.stepItemText}>2. Click the Windows download button — save the .exe installer</Text>
              <Text style={styles.stepItemText}>3. Run the installer and select &quot;Install for me only&quot;</Text>
              <Text style={styles.stepItemText}>4. Click Next through setup — keep all default options</Text>
              <Text style={styles.stepItemText}>5. Launch Thonny from the Start Menu or Desktop shortcut</Text>
            </View>
          </View>

          {/* Mac Thonny */}
          <View style={styles.stepRow}>
            <Text style={styles.stepBadge}>M</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>macOS Installation</Text>
              <Text style={styles.stepItemText}>1. Go to: thonny.org and click the macOS download (.pkg)</Text>
              <Text style={styles.stepItemText}>2. Open the downloaded .pkg file from Downloads</Text>
              <Text style={styles.stepItemText}>3. Follow the installer — click Continue → Install</Text>
              <Text style={styles.stepItemText}>4. Find Thonny in your Applications folder and launch it</Text>
            </View>
          </View>

          {/* Checklist */}
          <Text style={styles.sectionTitle}>Checklist for Day 1</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>☐  Laptop with Scratch Desktop + Thonny installed</Text>
            <Text style={styles.infoBoxText}>☐  Laptop charger</Text>
            <Text style={styles.infoBoxText}>☐  Water bottle (labeled with student name)</Text>
            <Text style={styles.infoBoxText}>☐  Snack (nut-free)</Text>
          </View>

          {/* Contact */}
          <View style={[styles.infoBox, { borderLeftColor: green, backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.infoBoxTitle, { color: '#065F46' }]}>Questions? We&apos;re here to help.</Text>
            <Text style={[styles.infoBoxText, { color: '#047857' }]}>
              Email: team.elevate@gwelevate.com | California Educational Services — 0% Sales Tax
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© 2026 Elevate Coders — Fall Welcome Packet</Text>
          <Text style={styles.footerText}>elevatecoders.com</Text>
        </View>
      </Page>
    </Document>
  )
}
