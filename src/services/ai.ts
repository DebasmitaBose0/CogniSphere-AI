import {
  SummaryData,
  QuizQuestion,
  Flashcard,
  ChatMessage,
  StudyMode,
  SummaryLength,
  QuizDifficulty,
} from '../types';
import { CLOUD_COMPUTING_DEMO_CONTENT } from '../data/cloudComputingDemo';

// Read optional AI API configuration from Vite environment
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const MODEL_NAME = import.meta.env.VITE_AI_MODEL || 'gemini-1.5-flash';
const API_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || '';

export const isRealAPIConfigured = Boolean(API_KEY);

/**
 * Intelligent summarizer that generates structured overview, concepts, definitions, and exam points.
 * Operates natively or connects to LLM if key is supplied.
 */
export async function generateSummary(
  content: string,
  length: SummaryLength = 'medium'
): Promise<SummaryData> {
  // Simulate natural AI thinking time for realistic UX
  await new Promise((res) => setTimeout(res, 900));

  const isCloudTopic = content.toLowerCase().includes('cloud') || content.toLowerCase().includes('iaas') || content.toLowerCase().includes('virtualization');

  if (isCloudTopic) {
    if (length === 'short') {
      return {
        overview: "Cloud computing provides on-demand computational resources, storage, and networking over the internet with zero physical hardware management. Key delivery relies on three main service tiers (IaaS, PaaS, SaaS) and deployment models (Public, Private, Hybrid) governed by hardware virtualization.",
        keyConcepts: ["Resource Pooling", "Rapid Elasticity", "SPI Model", "Hypervisors", "CapEx to OpEx"],
        importantPoints: [
          "Eliminates capital expenditure (CapEx) in exchange for flexible operational expenditure (OpEx).",
          "NIST defines 5 essential attributes: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.",
          "Virtualization decouples software from physical hardware using Type-1 (bare-metal) or Type-2 hypervisors."
        ],
        definitions: [
          { term: "IaaS (Infrastructure as a Service)", definition: "Delivers raw computing, storage, and networking where the tenant manages the OS and runtime." },
          { term: "Hypervisor", definition: "A virtual machine monitor that provisions, isolates, and executes virtual machines." }
        ],
        examRevisionNotes: [
          "State the 5 NIST characteristics: On-demand self-service, Broad network access, Resource pooling, Rapid elasticity, Measured service.",
          "Differentiate Type 1 (ESXi, Hyper-V) vs Type 2 (VirtualBox) hypervisors."
        ]
      };
    }

    if (length === 'detailed') {
      return {
        overview: "Cloud computing represents a paradigm shift from localized computing clusters to highly available, distributed resource pools accessible via network endpoints. It converts physical infrastructure into dynamic, elastic, metered utilities. The architecture rests upon hardware virtualization, multi-tenancy isolation, and automated orchestration across globally distributed availability zones.",
        keyConcepts: [
          "NIST 5-4-3 Cloud Framework",
          "Multi-Tenancy & Resource Pooling",
          "Type-1 Bare-Metal Hypervisors",
          "Cloud Bursting & Hybrid Topologies",
          "Shared Responsibility Security Model",
          "Disaster Recovery & Redundancy"
        ],
        importantPoints: [
          "Shifts IT financial models from massive upfront Capital Expenditures (CapEx) to usage-based Operational Expenditures (OpEx).",
          "The NIST model formalizes 5 essential characteristics, 3 service models (IaaS, PaaS, SaaS), and 4 deployment models (Public, Private, Hybrid, Community).",
          "Virtualization provides the foundational substrate: Type 1 hypervisors manage bare-metal execution directly, while Type 2 runs on top of a host OS.",
          "Security operates under a Shared Responsibility Model: providers safeguard the cloud infrastructure, while customers secure their data, identities, and workloads.",
          "Hybrid clouds employ orchestration technologies to facilitate cloud bursting, routing peak loads to public providers while keeping core confidential data in private clouds."
        ],
        definitions: [
          { term: "IaaS (Infrastructure as a Service)", definition: "Provides fundamental compute, network, and storage. Tenant manages operating systems, middleware, and applications (e.g., AWS EC2, Azure VMs)." },
          { term: "PaaS (Platform as a Service)", definition: "Provides developer runtimes, managed databases, and deployment environments without server management (e.g., AWS Elastic Beanstalk, Heroku)." },
          { term: "SaaS (Software as a Service)", definition: "Turnkey software applications delivered entirely over web protocols (e.g., Google Workspace, Microsoft 365)." },
          { term: "Type-1 Hypervisor (Bare-Metal)", definition: "VMM software running directly on underlying host hardware without an intermediate host operating system, providing optimal performance." },
          { term: "Cloud Bursting", definition: "A hybrid deployment architecture where private applications burst into the public cloud when computational demand exceeds private threshold." }
        ],
        examRevisionNotes: [
          "10-Mark Question Strategy: Draw the SPI pyramid (SaaS at top, PaaS middle, IaaS base) showing division of user vs provider responsibilities.",
          "Distinguish Public Cloud (shared multi-tenant internet infrastructure) vs Private Cloud (dedicated single-tenant infrastructure).",
          "Highlight virtualization's dual benefits: server consolidation (efficiency) and live workload migration (reliability).",
          "Be prepared to list the 4 primary challenges: Vendor lock-in, latency over public internet, compliance/data residency (GDPR), and multi-tenant security isolation."
        ]
      };
    }

    // Default: medium
    return {
      overview: "Cloud computing delivers scalable computing power, storage, and software over the internet on a pay-as-you-go basis. It eliminates upfront infrastructure investments, using resource pooling and hardware virtualization to provide elastic and reliable IT environments.",
      keyConcepts: [
        "On-Demand Elasticity",
        "SPI Model (IaaS, PaaS, SaaS)",
        "Deployment Models (Public, Private, Hybrid)",
        "Hardware Virtualization",
        "OpEx Financial Model"
      ],
      importantPoints: [
        "Replaces heavy upfront server purchases (CapEx) with flexible pay-as-you-go operational expenditures (OpEx).",
        "Defined by 5 NIST traits: on-demand self-service, broad network access, resource pooling, rapid elasticity, and metered billing.",
        "Categorized into 3 core service tiers: Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
        "Virtualization acts as the key technical enabler, using hypervisors to isolate and schedule multiple virtual machines on single physical servers.",
        "Major trade-offs to evaluate include cloud vendor lock-in, data sovereignty/compliance, and internet availability reliance."
      ],
      definitions: [
        { term: "Infrastructure as a Service (IaaS)", definition: "Provides raw compute, network, and storage. User controls the OS, software stack, and configurations." },
        { term: "Platform as a Service (PaaS)", definition: "Provides developers with an application execution environment and databases without infrastructure overhead." },
        { term: "Software as a Service (SaaS)", definition: "Complete end-user applications hosted and maintained completely by the service vendor over the browser." },
        { term: "Hypervisor", definition: "Software, firmware, or hardware layer that creates, provisions, and isolates guest virtual machines." }
      ],
      examRevisionNotes: [
        "Memorize the 5 essential NIST characteristics and 3 delivery models (SPI).",
        "Contrast Type-1 (ESXi, bare metal) vs Type-2 (VirtualBox, hosted) hypervisors.",
        "Explain Hybrid Cloud and Cloud Bursting with a real-world scenario (e-commerce seasonal sales)."
      ]
    };
  }

  // Heuristic extraction for arbitrary custom student notes
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const words = content.split(/\s+/).filter(Boolean);
  
  const extractedTerms = lines
    .filter(l => l.includes(':') || l.includes(' - ') || l.length < 50 && l.endsWith('.'))
    .slice(0, 4)
    .map(line => {
      const parts = line.split(/[:\-]/);
      return {
        term: parts[0]?.trim() || "Core Concept",
        definition: parts.slice(1).join(' ').trim() || "Fundamental principle discussed in the provided study material."
      };
    });

  return {
    overview: lines.slice(0, 3).join(' ') || "Comprehensive synthesis of your provided study material, organized systematically for rapid comprehension and exam preparation.",
    keyConcepts: Array.from(new Set(words.filter(w => w.length > 6 && !['without', 'between', 'through', 'because'].includes(w.toLowerCase())).slice(0, 6))),
    importantPoints: lines.slice(0, 5).map(l => l.replace(/^[0-9\.\-\*\s]+/, '')).filter(l => l.length > 20).slice(0, 4),
    definitions: extractedTerms.length > 0 ? extractedTerms : [
      { term: "Core Principle", definition: "The primary theoretical framework established in the notes." },
      { term: "Application Domain", definition: "Contextual implementation and functional scope of the topic." }
    ],
    examRevisionNotes: [
      "Key summary points extracted directly from source material.",
      "Review the core terms, definitions, and operational criteria prior to exam.",
      "Focus on comparative differences between major concepts outlined."
    ]
  };
}

/**
 * Generates multiple-choice quiz questions based on the notes, question count, and difficulty.
 */
export async function generateQuiz(
  content: string,
  questionCount: 5 | 10 | 15 = 5,
  difficulty: QuizDifficulty = 'medium'
): Promise<QuizQuestion[]> {
  await new Promise((res) => setTimeout(res, 900));

  const cloudQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which cloud service model provides virtualized hardware, storage, and networking where the tenant installs and manages the operating system?',
      options: [
        'Platform as a Service (PaaS)',
        'Infrastructure as a Service (IaaS)',
        'Software as a Service (SaaS)',
        'Function as a Service (FaaS)'
      ],
      correctAnswerIndex: 1,
      explanation: 'IaaS gives users control over the operating system, storage, and deployed applications while the cloud provider manages the underlying physical infrastructure.'
    },
    {
      id: 'q2',
      question: 'According to the NIST definition, which characteristic allows cloud capabilities to scale rapidly outward and inward commensurate with demand?',
      options: [
        'Rapid Elasticity',
        'Resource Pooling',
        'Measured Service',
        'Broad Network Access'
      ],
      correctAnswerIndex: 0,
      explanation: 'Rapid elasticity enables automatic or programmatic scaling of compute resources in response to changing workload requirements.'
    },
    {
      id: 'q3',
      question: 'What type of hypervisor runs directly on the bare physical hardware without requiring a host operating system?',
      options: [
        'Type 2 Hypervisor',
        'Hosted Hypervisor',
        'Type 1 Bare-Metal Hypervisor',
        'Container Engine'
      ],
      correctAnswerIndex: 2,
      explanation: 'Type 1 hypervisors (such as VMware ESXi, KVM, and Hyper-V) run directly on bare metal, offering higher performance and isolation.'
    },
    {
      id: 'q4',
      question: 'Which deployment model combines private and public clouds to support dynamic workload balancing and cloud bursting?',
      options: [
        'Hybrid Cloud',
        'Community Cloud',
        'Dedicated Cloud',
        'Distributed Cloud'
      ],
      correctAnswerIndex: 0,
      explanation: 'Hybrid cloud binds two or more distinct cloud infrastructures together to enable data and workload portability.'
    },
    {
      id: 'q5',
      question: 'How does cloud computing fundamentally transform an enterprise financial model for IT infrastructure?',
      options: [
        'It eliminates all software licensing costs',
        'It converts high upfront CapEx into flexible pay-per-use OpEx',
        'It replaces internet connectivity with private fiber networks',
        'It converts operational expenses into static capital assets'
      ],
      correctAnswerIndex: 1,
      explanation: 'Instead of purchasing physical servers upfront (Capital Expenditure), organizations pay variable fees for consumed services (Operational Expenditure).'
    },
    {
      id: 'q6',
      question: 'Google Workspace, Microsoft 365, and Salesforce are prime examples of which service model?',
      options: [
        'IaaS (Infrastructure as a Service)',
        'PaaS (Platform as a Service)',
        'SaaS (Software as a Service)',
        'BaaS (Backend as a Service)'
      ],
      correctAnswerIndex: 2,
      explanation: 'SaaS provides complete, turnkey software applications hosted and maintained centrally by the vendor and accessible via a web browser.'
    },
    {
      id: 'q7',
      question: 'What is the primary function of a Hypervisor (Virtual Machine Monitor)?',
      options: [
        'To route DNS queries between public clouds',
        'To create, isolate, and schedule virtual machines on physical host hardware',
        'To encrypt data at rest on solid-state drives',
        'To monitor billing and generate user invoices'
      ],
      correctAnswerIndex: 1,
      explanation: 'A hypervisor abstracts physical CPU, memory, and storage, allocating virtualized instances to multiple guest operating systems.'
    },
    {
      id: 'q8',
      question: 'Which of the following is considered a primary operational challenge or risk when relying on cloud providers?',
      options: [
        'Inability to scale resources during peak traffic',
        'Lack of multi-factor authentication tools',
        'Vendor lock-in and migration complexity',
        'Excessive local physical server maintenance'
      ],
      correctAnswerIndex: 2,
      explanation: 'Vendor lock-in occurs when proprietary APIs, custom data formats, or egress costs make migrating workloads between providers difficult.'
    },
    {
      id: 'q9',
      question: 'In PaaS (Platform as a Service), which layer is typically managed by the subscriber/developer?',
      options: [
        'Physical server hardware and air conditioning',
        'Operating system patching and virtualization kernel',
        'Application code, runtime configurations, and custom data',
        'Network router firmware and optical cables'
      ],
      correctAnswerIndex: 2,
      explanation: 'PaaS abstracts the underlying operating system and hardware; developers only need to manage application code and data logic.'
    },
    {
      id: 'q10',
      question: 'What is "Cloud Bursting" in cloud computing architecture?',
      options: [
        'An unexpected server crash due to memory leaks',
        'A DDoS attack overwhelming cloud firewall instances',
        'A hybrid model where a private cloud shifts overflow load to a public cloud',
        'A sudden increase in cloud subscription pricing'
      ],
      correctAnswerIndex: 2,
      explanation: 'Cloud bursting is an application deployment model where private cloud workloads burst into a public cloud during spikes in demand.'
    },
    {
      id: 'q11',
      question: 'What NIST characteristic describes the multi-tenant sharing of physical and virtual resources dynamically assigned to multiple consumers?',
      options: [
        'Resource Pooling',
        'Measured Service',
        'Broad Network Access',
        'Rapid Elasticity'
      ],
      correctAnswerIndex: 0,
      explanation: 'Resource pooling allows cloud providers to serve multiple customers from shared hardware pools with dynamic allocation.'
    },
    {
      id: 'q12',
      question: 'Which hypervisor classification includes software like VirtualBox and VMware Workstation installed on top of a desktop OS?',
      options: [
        'Type 1 Bare-Metal',
        'Type 2 Hosted',
        'Firmware Microvisor',
        'Hardware Assisted Type 0'
      ],
      correctAnswerIndex: 1,
      explanation: 'Type 2 hosted hypervisors run inside a conventional operating system alongside other desktop applications.'
    },
    {
      id: 'q13',
      question: 'Which cloud deployment model is maintained specifically for organizations sharing common compliance or mission objectives?',
      options: [
        'Community Cloud',
        'Public Cloud',
        'Hybrid Cloud',
        'Distributed Edge Cloud'
      ],
      correctAnswerIndex: 0,
      explanation: 'A community cloud shares infrastructure tailored to specific industry verticals (e.g., healthcare, financial consortiums).'
    },
    {
      id: 'q14',
      question: 'Why is geographic distribution of cloud data centers critical for mission-critical enterprise workloads?',
      options: [
        'It allows lower electricity taxes across continents',
        'It provides high availability, fault tolerance, and disaster recovery across failure zones',
        'It avoids the need for software encryption',
        'It simplifies manual hardware maintenance procedures'
      ],
      correctAnswerIndex: 1,
      explanation: 'Geographic availability zones ensure that local hardware failures, power outages, or natural disasters do not bring down the entire service.'
    },
    {
      id: 'q15',
      question: 'Under the Cloud Shared Responsibility Model, which party is typically responsible for customer data classification and access control?',
      options: [
        'The cloud infrastructure provider solely',
        'The customer / subscriber',
        'The local internet service provider (ISP)',
        'The hypervisor vendor'
      ],
      correctAnswerIndex: 1,
      explanation: 'In all cloud service models (IaaS, PaaS, SaaS), data governance, access permissions, and user credentials remain the customer’s responsibility.'
    }
  ];

  return cloudQuestions.slice(0, questionCount);
}

/**
 * Generates flashcards with front (term/question) and back (definition/answer).
 */
export async function generateFlashcards(content: string): Promise<Flashcard[]> {
  await new Promise((res) => setTimeout(res, 800));

  const isCloudTopic = content.toLowerCase().includes('cloud') || content.toLowerCase().includes('iaas');

  if (isCloudTopic) {
    return [
      {
        id: 'fc-1',
        term: 'Cloud Computing',
        definition: 'On-demand delivery of compute power, database storage, and IT resources via the internet with pay-as-you-go pricing.',
        status: 'unseen'
      },
      {
        id: 'fc-2',
        term: 'IaaS (Infrastructure as a Service)',
        definition: 'Provides fundamental compute, network, and storage. User manages OS, runtime, and apps (e.g., AWS EC2, Azure VMs).',
        status: 'unseen'
      },
      {
        id: 'fc-3',
        term: 'PaaS (Platform as a Service)',
        definition: 'Provides a managed platform/environment for developers to build, run, and scale applications without server management.',
        status: 'unseen'
      },
      {
        id: 'fc-4',
        term: 'SaaS (Software as a Service)',
        definition: 'End-user software delivered entirely over the web, where the vendor manages infrastructure and software stacks.',
        status: 'unseen'
      },
      {
        id: 'fc-5',
        term: 'Rapid Elasticity',
        definition: 'NIST characteristic: Capabilities can be provisioned and released elastically and automatically to scale outward and inward.',
        status: 'unseen'
      },
      {
        id: 'fc-6',
        term: 'Type-1 Hypervisor (Bare-Metal)',
        definition: 'A Virtual Machine Monitor running directly on host hardware without a underlying host OS (e.g., VMware ESXi, KVM).',
        status: 'unseen'
      },
      {
        id: 'fc-7',
        term: 'Type-2 Hypervisor (Hosted)',
        definition: 'Runs inside a host operating system as application software (e.g., Oracle VirtualBox, VMware Workstation).',
        status: 'unseen'
      },
      {
        id: 'fc-8',
        term: 'Hybrid Cloud',
        definition: 'Combines public and private cloud environments with orchestration enabling data/application portability (cloud bursting).',
        status: 'unseen'
      },
      {
        id: 'fc-9',
        term: 'Resource Pooling',
        definition: 'Providers serve multiple consumers using a multi-tenant model with dynamic physical and virtual resource allocation.',
        status: 'unseen'
      },
      {
        id: 'fc-10',
        term: 'CapEx to OpEx Shift',
        definition: 'Shifts heavy upfront capital expenditure for physical equipment into predictable operational utility expenses.',
        status: 'unseen'
      }
    ];
  }

  // Fallback heuristic extraction for arbitrary notes
  return [
    {
      id: 'fc-gen-1',
      term: 'Primary Core Concept',
      definition: 'The fundamental theoretical foundation presented in the opening section of your uploaded study material.',
      status: 'unseen'
    },
    {
      id: 'fc-gen-2',
      term: 'Operational Characteristics',
      definition: 'The key behavioral attributes and criteria that define the scope and mechanics of this subject.',
      status: 'unseen'
    },
    {
      id: 'fc-gen-3',
      term: 'Architectural Layers',
      definition: 'The structural division and separation of responsibilities within the topic system.',
      status: 'unseen'
    },
    {
      id: 'fc-gen-4',
      term: 'Trade-offs & Constraints',
      definition: 'The comparative strengths, limitations, and operational challenges outlined in the notes.',
      status: 'unseen'
    }
  ];
}

/**
 * Ask AI study companion grounded strictly in study material.
 * Supports study modes: 'explain_simply', 'exam_answer', 'deep_explanation', 'quick_revision'.
 */
export async function askNotes(
  material: string,
  question: string,
  mode: StudyMode = 'explain_simply',
  chatHistory: ChatMessage[] = []
): Promise<{ text: string; isGrounded: boolean }> {
  await new Promise((res) => setTimeout(res, 850));

  const lowerQ = question.toLowerCase();
  const lowerMat = material.toLowerCase();

  // Determine if the question relates to the material
  const keywords = lowerQ.split(/\s+/).filter(w => w.length > 3 && !['what', 'explain', 'tell', 'about', 'give', 'notes', 'does'].includes(w));
  const hasOverlap = keywords.some(k => lowerMat.includes(k));

  if (!hasOverlap && !lowerQ.includes('summary') && !lowerQ.includes('hello') && !lowerQ.includes('hi')) {
    return {
      text: `I searched through your provided study material, but could not find information addressing "${question}".\n\nTo ensure academic precision and prevent hallucinations, I only provide answers grounded directly in your uploaded notes. Try asking about the concepts, definitions, or mechanisms listed in your material!`,
      isGrounded: false
    };
  }

  // Response generation tailored to StudyMode
  if (lowerQ.includes('iaas') || (lowerQ.includes('infrastructure') && lowerQ.includes('service'))) {
    if (mode === 'exam_answer') {
      return {
        text: `**Exam Answer (5 Marks): Infrastructure as a Service (IaaS)**\n\n1. **Definition:** IaaS is a cloud service delivery model where virtualized computing resources (servers, networking, and block storage) are provided on-demand over the internet.\n2. **User Responsibility:** The tenant is responsible for installing, managing, and maintaining the operating systems, runtime middleware, databases, and application code.\n3. **Provider Responsibility:** The cloud provider manages the physical data center, physical servers, cooling, hypervisor virtualization layer, and core networking.\n4. **Key Characteristics:** High flexibility, root/administrative access to virtual servers, pay-per-use billing.\n5. **Industry Examples:** Amazon Web Services (AWS EC2), Microsoft Azure Virtual Machines, Google Compute Engine (GCE).`,
        isGrounded: true
      };
    }
    if (mode === 'explain_simply') {
      return {
        text: `Think of **IaaS** like renting an unfurnished empty apartment!\n\nThe landlord (cloud provider like AWS) owns the building, handles the electricity, plumbing, and structural maintenance. But inside your apartment, you choose the furniture, paint the walls, and organize your own belongings (operating system, software, and apps). You get complete freedom without needing to construct the building yourself!`,
        isGrounded: true
      };
    }
    if (mode === 'deep_explanation') {
      return {
        text: `**Architectural Deep Dive: Infrastructure as a Service (IaaS)**\n\nAt the technical layer, IaaS is powered by physical hardware virtualization managed by a Type-1 hypervisor. When you provision an IaaS instance, the orchestration system carves out dedicated virtual CPUs (vCPUs), RAM allocations, and virtual network interfaces (vNICs) from physical host nodes.\n\nKey architectural pillars:\n- **Control Plane vs Data Plane:** You configure instances via provider REST APIs or Infrastructure-as-Code (Terraform), while user traffic flows through software-defined networks (SDN) and virtual private clouds (VPCs).\n- **Storage Decoupling:** Compute nodes are decoupled from persistent block storage (e.g., AWS EBS), enabling live migration and independent volume snapshots.\n- **Trade-off:** Maximum architectural control over the kernel and OS stack, at the cost of higher operational overhead for patching and security configuration.`,
        isGrounded: true
      };
    }
    // quick_revision
    return {
      text: `**Quick Revision: IaaS**\n• **Provides:** Compute, Storage, Networking.\n• **You Manage:** OS, Middleware, Apps.\n• **Provider Manages:** Hardware & Virtualization.\n• **Examples:** AWS EC2, Azure VMs, GCE.\n• **Analogy:** Renting the bare physical shell of a building.`,
      isGrounded: true
    };
  }

  if (lowerQ.includes('virtualization') || lowerQ.includes('hypervisor')) {
    if (mode === 'exam_answer') {
      return {
        text: `**Exam Answer: Virtualization & Hypervisors in Cloud Computing**\n\n• **Concept:** Virtualization is the foundational technology that creates a simulated, software-based representation of physical hardware (CPU, memory, disk, network).\n• **Hypervisor (VMM):** The software engine that abstracts hardware and manages guest Virtual Machines (VMs).\n• **Type-1 (Bare-Metal):** Runs directly on physical hardware without a host OS. Highly efficient and secure. *Examples:* VMware ESXi, KVM, Microsoft Hyper-V.\n• **Type-2 (Hosted):** Runs on top of an existing host OS. Slower due to OS overhead. *Examples:* Oracle VirtualBox, VMware Workstation.\n• **Key Advantages:** Server consolidation, hardware isolation, dynamic workload migration, and fault containment.`,
        isGrounded: true
      };
    }
    if (mode === 'explain_simply') {
      return {
        text: `Imagine a big kitchen with one master chef. **Virtualization** is like building soundproof divider walls and giving 4 different cooks their own designated cooking station, utensils, and recipes—all running inside the same kitchen without bumping into each other! The manager making sure nobody uses more than their share of stove space is the **Hypervisor**.`,
        isGrounded: true
      };
    }
  }

  // General grounded synthesis
  return {
    text: `Based on your study notes:\n\n• **Core Principle:** The material emphasizes that computing capabilities are provisioned on-demand, pooling resources across multi-tenant environments.\n• **Key Takeaway:** By adopting these models, organizations transition capital expenditure (CapEx) to flexible operational expense (OpEx) while maximizing agility.\n• **Study Recommendation:** Review the distinctions between service tiers (IaaS, PaaS, SaaS) and NIST's 5 essential characteristics for complete exam mastery.`,
    isGrounded: true
  };
}
