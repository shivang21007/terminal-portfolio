export const USER = "shivang";
export const HOSTNAME = "shivanggupta.in";
export const FULL_NAME = "Shivang Gupta";
export const LOCATION = "Delhi, India";
export const ROLE = "DevOps & Site Reliability Engineer";
export const COMPANY = "Octro Inc., Noida";
export const LinkedIn = "https://linkedin.com/in/shivang21007";
export const GitHub = "https://github.com/shivang21007";
export const Email = "shivanggupta2611@gmail.com";
export const Phone = "+918081260068";
export const Website = "https://shivanggupta.in";
export const LiveDemoUrl = "https://devops.shivanggupta.in:8443/";

export const projects = [
  {
    title: "SkillPulse → 3-Tier App with Kubernetes CI/CD Pipeline",
    liveUrl: LiveDemoUrl,
    bullets: [
      "Built and deployed a production-grade 3-tier app (HTML/CSS/JS, Golang/Gin, MySQL) on Kubernetes with automated CI/CD via GitHub Actions.",
      "Optimized Docker images with multi-stage builds — frontend 92 MB → 20 MB, backend 34 MB → 12 MB.",
      "Configured rolling deployments with HPA-based autoscaling for zero-manual code-to-production delivery.",
      "Integrated security scanning (golangci-lint, Gitleaks, govulncheck, Hadolint, Trivy) as automated CI gates.",
    ],
  },
  {
    title: "2-Tier App with Automated CI/CD & Docker Compose Deployment",
    liveUrl: LiveDemoUrl,
    bullets: [
      "Built end-to-end CI/CD for a React/Node.js app — automated build, scan, and deploy to VPS via Docker Compose.",
      "Embedded SAST (Snyk), dependency scanning, secret detection, and Trivy container scanning as pipeline gates.",
      "Remediated 19 High and 2 Critical vulnerabilities by hardening base images and dependency layers.",
      "Achieved fully automated delivery: Code → CI Checks → Image Build → Scan → Deploy.",
    ],
  },
];

export const files: Record<string, string> = {
  "about.txt": `${ROLE} @ ${COMPANY}
Sept 2024 – Present | ${LOCATION}

DevOps & Site Reliability Engineer with hands-on experience in Kubernetes,
Terraform, CI/CD, and AWS. Proven track record in building scalable
cloud-native infrastructure, optimizing cost, and automating workflows
to ensure highly reliable production systems.

Education:
  B.Tech in Computer Science and Engineering (2021–2025)
  G.L. Bajaj Institute of Technology and Management, Greater Noida`,

  "skills.txt": `Core Expertise:
  - Kubernetes, Docker, Docker Compose
  - Terraform, AWS (EC2, S3, IAM, Route53)
  - GitHub Actions, ArgoCD, GitOps, CI/CD
  - Prometheus, Grafana, Loki, OpenTelemetry
  - Trivy, Snyk, Gitleaks, Hadolint (DevSecOps)
  - Python, Bash, Golang
  - MySQL, Redis
  - Linux, Infrastructure as Code, Observability`,

  "projects.txt": projects
    .map(
      (p) =>
        `${p.title}\n  Live: ${p.liveUrl}\n${p.bullets.map((b) => `  - ${b}`).join("\n")}`,
    )
    .join("\n\n"),

  "contact.txt": `Let's connect:
  Location: ${LOCATION}
  Email: ${Email}
  Phone: ${Phone}
  Website: ${Website}
  LinkedIn: ${LinkedIn}
  GitHub: ${GitHub}`,
};

export const ifconfig: string = `
    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 30145  bytes 6044639 (6.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 30145  bytes 6044639 (6.0 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe89::20c:19ff:fe01:2  prefixlen 64  scopeid 0x20<link>
        ether 02:0c:29:01:02:03  txqueuelen 1000  (Ethernet)
        RX packets 1234567  bytes 1024000000 (1.0 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1234567  bytes 1024000000 (1.0 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
`;
