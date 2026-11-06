export interface PharmacyClass {
  id: string;
  name: string;
  shortCode: string;
  program: 'B.Pharm' | 'D.Pharm';
  theorySubjects: string[];
  practicalSubjects: string[];
}

export const PHARMACY_CURRICULUM: PharmacyClass[] = [
  {
    id: 'First Year (B.Pharm)',
    name: 'First Year (B.Pharm)',
    shortCode: 'F.Y. B.Pharm',
    program: 'B.Pharm',
    theorySubjects: [
      'Human Anatomy and Physiology I (Sem 1)',
      'Pharmaceutical Analysis I (Sem 1)',
      'Pharmaceutics I (Sem 1)',
      'Pharmaceutical Inorganic Chemistry (Sem 1)',
      'Communication Skills (Sem 1)',
      'Remedial Biology / Remedial Mathematics (Sem 1)',
      'Human Anatomy and Physiology II (Sem 2)',
      'Pharmaceutical Organic Chemistry I (Sem 2)',
      'Biochemistry (Sem 2)',
      'Pathophysiology (Sem 2)',
      'Computer Applications in Pharmacy (Sem 2)',
      'Environmental Sciences (Sem 2)',
    ],
    practicalSubjects: [
      'Human Anatomy and Physiology I - Practical (Sem 1)',
      'Pharmaceutical Analysis I - Practical (Sem 1)',
      'Pharmaceutics I - Practical (Sem 1)',
      'Pharmaceutical Inorganic Chemistry - Practical (Sem 1)',
      'Communication Skills - Practical (Sem 1)',
      'Human Anatomy and Physiology II - Practical (Sem 2)',
      'Pharmaceutical Organic Chemistry I - Practical (Sem 2)',
      'Biochemistry - Practical (Sem 2)',
      'Computer Applications in Pharmacy - Practical (Sem 2)',
    ],
  },
  {
    id: 'Second Year (B.Pharm)',
    name: 'Second Year (B.Pharm)',
    shortCode: 'S.Y. B.Pharm',
    program: 'B.Pharm',
    theorySubjects: [
      'Pharmaceutical Organic Chemistry II (Sem 3)',
      'Physical Pharmaceutics I (Sem 3)',
      'Pharmaceutical Microbiology (Sem 3)',
      'Pharmaceutical Engineering (Sem 3)',
      'Pharmaceutical Organic Chemistry III (Sem 4)',
      'Medicinal Chemistry I (Sem 4)',
      'Physical Pharmaceutics II (Sem 4)',
      'Pharmacology I (Sem 4)',
      'Pharmacognosy and Phytochemistry I (Sem 4)',
    ],
    practicalSubjects: [
      'Pharmaceutical Organic Chemistry II - Practical (Sem 3)',
      'Physical Pharmaceutics I - Practical (Sem 3)',
      'Pharmaceutical Microbiology - Practical (Sem 3)',
      'Pharmaceutical Engineering - Practical (Sem 3)',
      'Medicinal Chemistry I - Practical (Sem 4)',
      'Physical Pharmaceutics II - Practical (Sem 4)',
      'Pharmacology I - Practical (Sem 4)',
      'Pharmacognosy and Phytochemistry I - Practical (Sem 4)',
    ],
  },
  {
    id: 'Third Year (B.Pharm)',
    name: 'Third Year (B.Pharm)',
    shortCode: 'T.Y. B.Pharm',
    program: 'B.Pharm',
    theorySubjects: [
      'Medicinal Chemistry II (Sem 5)',
      'Industrial Pharmacy I (Sem 5)',
      'Pharmacology II (Sem 5)',
      'Pharmacognosy and Phytochemistry II (Sem 5)',
      'Pharmaceutical Jurisprudence (Sem 5)',
      'Medicinal Chemistry III (Sem 6)',
      'Pharmacology III (Sem 6)',
      'Herbal Drug Technology (Sem 6)',
      'Biopharmaceutics and Pharmacokinetics (Sem 6)',
      'Pharmaceutical Biotechnology (Sem 6)',
      'Quality Assurance (Sem 6)',
    ],
    practicalSubjects: [
      'Medicinal Chemistry II - Practical (Sem 5)',
      'Industrial Pharmacy I - Practical (Sem 5)',
      'Pharmacology II - Practical (Sem 5)',
      'Pharmacognosy and Phytochemistry II - Practical (Sem 5)',
      'Medicinal Chemistry III - Practical (Sem 6)',
      'Pharmacology III - Practical (Sem 6)',
      'Herbal Drug Technology - Practical (Sem 6)',
      'Pharmaceutical Biotechnology - Practical (Sem 6)',
    ],
  },
  {
    id: 'Fourth Year (B.Pharm)',
    name: 'Fourth Year (B.Pharm)',
    shortCode: 'Final Year B.Pharm',
    program: 'B.Pharm',
    theorySubjects: [
      'Instrumental Methods of Analysis (Sem 7)',
      'Industrial Pharmacy II (Sem 7)',
      'Pharmacy Practice (Sem 7)',
      'Novel Drug Delivery Systems (Sem 7)',
      'Biostatistics and Research Methodology (Sem 8)',
      'Social and Preventive Pharmacy (Sem 8)',
      'Pharma Marketing Management / Electives (Sem 8)',
    ],
    practicalSubjects: [
      'Instrumental Methods of Analysis - Practical (Sem 7)',
      'Pharmacy Practice - Practical (Sem 7)',
      'Project Work / Industrial Training (Sem 8)',
    ],
  },
  {
    id: 'First Year (D.Pharm)',
    name: 'First Year (D.Pharm)',
    shortCode: 'F.Y. D.Pharm',
    program: 'D.Pharm',
    theorySubjects: [
      'Pharmaceutics',
      'Pharmaceutical Chemistry',
      'Pharmacognosy',
      'Biochemistry & Clinical Pathology',
      'Human Anatomy & Physiology',
      'Social Pharmacy',
    ],
    practicalSubjects: [
      'Pharmaceutics - Practical',
      'Pharmaceutical Chemistry - Practical',
      'Pharmacognosy - Practical',
      'Biochemistry & Clinical Pathology - Practical',
      'Human Anatomy & Physiology - Practical',
    ],
  },
  {
    id: 'Second Year (D.Pharm)',
    name: 'Second Year (D.Pharm)',
    shortCode: 'S.Y. D.Pharm',
    program: 'D.Pharm',
    theorySubjects: [
      'Pharmaceutics-II',
      'Pharmaceutical Chemistry-II',
      'Pharmacology & Toxicology',
      'Hospital & Clinical Pharmacy',
      'Pharmaceutical Jurisprudence',
      'Drug Store & Business Management',
    ],
    practicalSubjects: [
      'Pharmaceutics-II - Practical',
      'Pharmaceutical Chemistry-II - Practical',
      'Pharmacology & Toxicology - Practical',
      'Hospital & Clinical Pharmacy - Practical',
    ],
  },
];

// Helper to normalize legacy or varied year labels to match curriculum IDs
export const normalizeClassId = (rawYear: string): string => {
  const normalized = rawYear.toLowerCase().trim();
  if (normalized.includes('d.pharm') || normalized.includes('d. pharm')) {
    if (normalized.includes('first') || normalized.includes('f.y') || normalized.includes('1st')) {
      return 'First Year (D.Pharm)';
    }
    return 'Second Year (D.Pharm)';
  }
  
  if (normalized.includes('first') || normalized.includes('f.y') || normalized.includes('1st')) {
    return 'First Year (B.Pharm)';
  }
  if (normalized.includes('second') || normalized.includes('s.y') || normalized.includes('2nd')) {
    return 'Second Year (B.Pharm)';
  }
  if (normalized.includes('third') || normalized.includes('t.y') || normalized.includes('3rd')) {
    return 'Third Year (B.Pharm)';
  }
  if (normalized.includes('fourth') || normalized.includes('final') || normalized.includes('4th')) {
    return 'Fourth Year (B.Pharm)';
  }

  return rawYear;
};

export const getClassConfig = (year: string): PharmacyClass | undefined => {
  const matchedId = normalizeClassId(year);
  return PHARMACY_CURRICULUM.find(c => c.id === matchedId || c.name === year || c.shortCode.toLowerCase() === year.toLowerCase());
};
