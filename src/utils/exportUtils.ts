import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { format, parseISO } from 'date-fns';
import { Habit, DailyLog } from '../types';

// Generate PDF Report
export const generatePDFReport = (habit: Habit, logs: DailyLog[], userName: string) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(138, 85, 247); // Purple
    doc.text('HabitFlow Progress Report', 20, 20);

    // User info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${userName}`, 20, 30);
    doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 35);

    // Habit Info Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Habit Overview', 20, 50);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${habit.name}`, 25, 60);
    doc.text(`Description: ${habit.description}`, 25, 67);
    doc.text(`Category: ${habit.category}`, 25, 74);
    doc.text(`Goal Type: ${habit.goalType || 'Daily'}`, 25, 81);
    doc.text(`Difficulty: ${habit.difficultyLevel || 'Medium'}`, 25, 88);

    // Statistics Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Statistics', 20, 105);

    const completedLogs = logs.filter(log => log.completed);
    const completionRate = logs.length > 0 ? ((completedLogs.length / logs.length) * 100).toFixed(1) : '0';

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Current Streak: ${habit.currentStreak} days`, 25, 115);
    doc.text(`Longest Streak: ${habit.longestStreak} days`, 25, 122);
    doc.text(`Total Completions: ${habit.totalCompletions}`, 25, 129);
    doc.text(`Completion Rate: ${completionRate}%`, 25, 136);
    doc.text(`Total XP Earned: ${habit.xpPerCompletion * habit.totalCompletions}`, 25, 143);

    // Activity Log Table
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Activity History', 20, 160);

    const tableData = logs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30) // Last 30 entries
        .map(log => [
            format(parseISO(log.date), 'MMM dd, yyyy'),
            log.completed ? '✓ Completed' : '✗ Missed',
            log.note || '-',
            `${log.xpEarned} XP`
        ]);

    autoTable(doc, {
        startY: 165,
        head: [['Date', 'Status', 'Note', 'XP']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [138, 85, 247] },
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 35 },
            2: { cellWidth: 80 },
            3: { cellWidth: 25 }
        }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount} | HabitFlow - Track Your Progress`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save(`${habit.name.replace(/\s+/g, '_')}_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Generate CSV Export
export const generateCSVExport = (habit: Habit, logs: DailyLog[]) => {
    const csvData = logs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(log => ({
            'Habit Name': habit.name,
            'Date': format(parseISO(log.date), 'yyyy-MM-dd'),
            'Day': format(parseISO(log.date), 'EEEE'),
            'Status': log.completed ? 'Completed' : 'Missed',
            'Note': log.note || '',
            'XP Earned': log.xpEarned,
            'Current Streak': habit.currentStreak,
            'Category': habit.category,
            'Difficulty': habit.difficultyLevel || 'Medium'
        }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${habit.name.replace(/\s+/g, '_')}_History_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Share Report (generates shareable text)
export const generateShareableReport = (habit: Habit, logs: DailyLog[], userName: string): string => {
    const completedLogs = logs.filter(log => log.completed);
    const completionRate = logs.length > 0 ? ((completedLogs.length / logs.length) * 100).toFixed(1) : '0';

    return `
🔥 HabitFlow Progress Report 🔥

👤 User: ${userName}
📅 Date: ${format(new Date(), 'MMMM dd, yyyy')}

📊 Habit: ${habit.name}
📝 Description: ${habit.description}
🎯 Category: ${habit.category}

📈 Statistics:
• Current Streak: ${habit.currentStreak} days 🔥
• Longest Streak: ${habit.longestStreak} days 🏆
• Total Completions: ${habit.totalCompletions} ✓
• Completion Rate: ${completionRate}% 📊
• Total XP: ${habit.xpPerCompletion * habit.totalCompletions} ⭐

💪 Keep up the great work!

Generated by HabitFlow - Track Your Progress
    `.trim();
};

// Generate Full User Progress PDF
export const generateFullUserPDFReport = (user: any, habits: Habit[], logs: DailyLog[]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(138, 85, 247); // Purple
    doc.text('HabitFlow: Full Progress Report', 20, 20);

    // User info
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`User: ${user.username} (${user.email})`, 20, 32);
    doc.text(`Level: ${user.level} | Total XP: ${user.totalXP}`, 20, 39);
    doc.text(`Report Date: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 46);

    // Platform Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Platform Summary', 20, 60);

    const totalCompletions = logs.filter(l => l.completed).length;
    const completionRate = logs.length > 0 ? ((totalCompletions / logs.length) * 100).toFixed(1) : '0';

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Habits Tracked: ${habits.length}`, 25, 70);
    doc.text(`Total Daily Logs: ${logs.length}`, 25, 77);
    doc.text(`Overall Completion Rate: ${completionRate}%`, 25, 84);

    // Habits Table
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Habits Overview', 20, 100);

    const habitsData = habits.map(h => [
        h.name,
        h.category,
        `${h.currentStreak}d`,
        `${h.longestStreak}d`,
        h.totalCompletions.toString()
    ]);

    autoTable(doc, {
        startY: 105,
        head: [['Habit Name', 'Category', 'Current Streak', 'Max Streak', 'Total ✅']],
        body: habitsData,
        theme: 'grid',
        headStyles: { fillColor: [138, 85, 247] }
    });

    // Detailed Activity (last 50 logs)
    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Activity History', 20, finalY + 20);

    const logsData = logs
        .slice(0, 50)
        .map(log => {
            const habit = habits.find(h => h._id === log.habitId);
            return [
                format(parseISO(log.date), 'MMM dd, yyyy'),
                habit?.name || 'Unknown',
                log.completed ? '✓' : '✗',
                log.note || '-',
                `${log.xpEarned} XP`
            ];
        });

    autoTable(doc, {
        startY: finalY + 25,
        head: [['Date', 'Habit', 'Status', 'Note', 'XP']],
        body: logsData,
        theme: 'striped',
        headStyles: { fillColor: [138, 85, 247] }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount} | HabitFlow Admin Tools`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`${user.username}_Full_Progress_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Generate Full User Progress CSV
export const generateFullUserCSVExport = (user: any, habits: Habit[], logs: DailyLog[]) => {
    const csvData = logs.map(log => {
        const habit = habits.find(h => h._id === log.habitId);
        return {
            'User': user.username,
            'Email': user.email,
            'Date': format(parseISO(log.date), 'yyyy-MM-dd'),
            'Habit Name': habit?.name || 'Unknown',
            'Category': habit?.category || '-',
            'Status': log.completed ? 'Completed' : 'Missed',
            'Note': log.note || '',
            'XP Earned': log.xpEarned
        };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${user.username}_Full_History_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};
