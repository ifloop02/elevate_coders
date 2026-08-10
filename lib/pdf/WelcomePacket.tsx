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

// react-pdf includes Helvetica, Courier, and Times built-in.
// No remote Font.register needed — avoids network calls at render time.

const purple = '#7C3AED'
const darkPurple = '#1E1B4B'
const green = '#10B981'
const lightGray = '#F9FAFB'
const gray = '#6B7280'
const border = '#E5E7EB'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    padding: 0,
  },
  header: {
    backgroundColor: darkPurple,
    padding: '32 40',
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  headerAccent: {
    color: '#A78BFA',
  },
  body: {
    padding: '28 40',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 700,
    color: darkPurple,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 11,
    color: gray,
    lineHeight: 1.7,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: darkPurple,
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: `1 solid ${border}`,
  },
  infoBox: {
    backgroundColor: lightGray,
    borderRadius: 8,
    padding: '14 16',
    marginBottom: 16,
    borderLeft: `3 solid ${purple}`,
  },
  infoBoxTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: purple,
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 11,
    color: gray,
    lineHeight: 1.6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8 12',
    backgroundColor: '#F5F3FF',
    borderRadius: 6,
    marginBottom: 6,
  },
  weekBadge: {
    backgroundColor: purple,
    borderRadius: 100,
    padding: '2 8',
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  weekText: {
    fontSize: 11,
    color: darkPurple,
    flex: 1,
    marginLeft: 10,
  },
  weekDates: {
    fontSize: 10,
    color: gray,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: purple,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.8,
    marginRight: 10,
    flexShrink: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: darkPurple,
    marginBottom: 3,
  },
  stepText: {
    fontSize: 10,
    color: gray,
    lineHeight: 1.6,
  },
  codeBlock: {
    backgroundColor: '#1E1B4B',
    borderRadius: 6,
    padding: '10 14',
    marginTop: 6,
    marginBottom: 8,
  },
  code: {
    fontSize: 10,
    color: '#A78BFA',
    fontFamily: 'Courier',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: `1 solid ${border}`,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  tag: {
    backgroundColor: '#D1FAE5',
    borderRadius: 4,
    padding: '2 6',
    fontSize: 9,
    fontWeight: 700,
    color: '#065F46',
  },
})

export default function WelcomePacketPDF({ studentName, track, weeks }: WelcomePacketPDFProps) {
  return (
    <Document
      title={`Elevate Coders Welcome Packet — ${studentName}`}
      author="Elevate Coders / TeamCoders"
      subject="Summer 2026 Camp Welcome Packet"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            ⚡ Elevate <Text style={styles.headerAccent}>Coders</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            Summer 2026 Welcome Packet — {track} Track
          </Text>
        </View>

        <View style={styles.body}>
          {/* Greeting */}
          <Text style={styles.greeting}>Welcome, {studentName}! 🎉</Text>
          <Text style={styles.paragraph}>
            We&apos;re thrilled to have you joining the Elevate Coders Summer 2026 program!
            This packet contains everything you need to get ready before your first day.
            Please follow the software installation steps below on the device your child
            will bring to camp (Windows or Mac).
          </Text>

          {/* Enrolled weeks */}
          {weeks.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Your Enrolled Weeks</Text>
              {weeks.map((week) => (
                <View key={week.weekNumber} style={styles.weekRow}>
                  <Text style={styles.weekBadge}>Week {week.weekNumber}</Text>
                  <Text style={styles.weekText}>{week.curriculum}</Text>
                  <Text style={styles.weekDates}>{week.dates}</Text>
                </View>
              ))}
            </>
          )}

          {/* Install Section 1 — Scratch */}
          <Text style={styles.sectionTitle}>Step 1 — Install Scratch Desktop</Text>
          <Text style={styles.paragraph}>
            Scratch Desktop lets your child create and run Scratch projects without an
            internet connection. This is required for Weeks 1–4.
          </Text>

          {/* Windows */}
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>W</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Windows Installation</Text>
              <Text style={styles.stepText}>
                1. Open your web browser and go to: scratch.mit.edu/download{'\n'}
                2. Click "Download for Windows" and save the .exe installer{'\n'}
                3. Open your Downloads folder and double-click Scratch Desktop Setup.exe{'\n'}
                4. Follow the install wizard — click Next → Install → Finish{'\n'}
                5. Look for the Scratch cat icon on your Desktop and double-click to launch
              </Text>
            </View>
          </View>

          {/* Mac */}
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>M</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>macOS Installation</Text>
              <Text style={styles.stepText}>
                1. Open Safari or Chrome and go to: scratch.mit.edu/download{'\n'}
                2. Click "Download for macOS" — a .dmg file will download{'\n'}
                3. Open the .dmg file from your Downloads folder{'\n'}
                4. Drag the Scratch Desktop app to your Applications folder{'\n'}
                5. Open Applications, find Scratch Desktop, and double-click to launch{'\n'}
                Note: If macOS blocks the app, go to System Settings → Privacy & Security → Open Anyway
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>✓ Test: Create a new project in Scratch Desktop</Text>
            <Text style={styles.infoBoxText}>
              When Scratch opens, you should see an orange cat sprite on a white stage. Click the
              green flag ▶ button. If the cat responds, you&apos;re all set!
            </Text>
          </View>

          {/* Install Section 2 — Thonny */}
          <Text style={styles.sectionTitle}>Step 2 — Install Thonny Python IDE</Text>
          <Text style={styles.paragraph}>
            Thonny is a beginner-friendly Python development environment. This is required
            for Weeks 5–8 (Python Exploration). Students who completed the beginners course
            may already have this installed.
          </Text>

          {/* Windows */}
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>W</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Windows Installation</Text>
              <Text style={styles.stepText}>
                1. Go to: thonny.org{'\n'}
                2. Click the Windows download button — save the .exe installer{'\n'}
                3. Run the installer and select "Install for me only" (no admin needed){'\n'}
                4. Click Next through the setup — keep all default options{'\n'}
                5. Launch Thonny from the Start Menu or Desktop shortcut
              </Text>
              <View style={styles.codeBlock}>
                <Text style={styles.code}>{`# Quick test — type this in Thonny's Shell panel:`}</Text>
                <Text style={styles.code}>{`print("Hello, TeamCoders!")`}</Text>
                <Text style={styles.code}>{`# Press Enter — you should see: Hello, TeamCoders!`}</Text>
              </View>
            </View>
          </View>

          {/* Mac */}
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>M</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>macOS Installation</Text>
              <Text style={styles.stepText}>
                1. Go to: thonny.org and click the macOS download (.pkg){'\n'}
                2. Open the downloaded .pkg file from Downloads{'\n'}
                3. Follow the installer — click Continue → Install{'\n'}
                4. Find Thonny in your Applications folder and launch it{'\n'}
                5. On first launch, choose "Standard" mode when prompted
              </Text>
              <View style={styles.codeBlock}>
                <Text style={styles.code}>{`# Quick test — type this in Thonny's Shell:`}</Text>
                <Text style={styles.code}>{`name = "TeamCoder"`}</Text>
                <Text style={styles.code}>{`print(f"Welcome, {name}!")`}</Text>
              </View>
            </View>
          </View>

          {/* What to bring */}
          <Text style={styles.sectionTitle}>What to Bring to Camp</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Checklist for Day 1</Text>
            <Text style={styles.infoBoxText}>
              ☐  Laptop or Chromebook with Scratch Desktop + Thonny installed{'\n'}
              ☐  Laptop charger{'\n'}
              ☐  Water bottle (labeled with your name){'\n'}
              ☐  Snack (nut-free if possible){'\n'}
              ☐  Excitement and curiosity! 🚀
            </Text>
          </View>

          {/* Contact */}
          <View style={[styles.infoBox, { borderLeft: `3 solid ${green}` }]}>
            <Text style={[styles.infoBoxTitle, { color: '#065F46' }]}>Questions? We&apos;re here to help.</Text>
            <Text style={styles.infoBoxText}>
              Email us any time at: team.elevate@gwelevate.com{'\n'}
              California Educational Services — 0% Sales Tax (Cal. Rev. & Tax. Code §6361)
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© 2026 Elevate Coders / TeamCoders — Summer Welcome Packet</Text>
          <Text style={styles.footerText}>elevatecoders.com</Text>
        </View>
      </Page>
    </Document>
  )
}
