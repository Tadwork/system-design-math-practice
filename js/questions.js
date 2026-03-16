const QUESTIONS = [
  // === APIs (3) ===
  {
    id: 1,
    topic: "APIs",
    question: "A REST API endpoint returns JSON payloads averaging 5 KB. If the server handles 10,000 requests/sec, how much outbound bandwidth is needed?",
    unit: "MB/s",
    acceptableRange: [30, 75],
    referenceAnswer: 50,
    explanation: "5 KB × 10,000 = 50,000 KB/s = ~50 MB/s",
    tip: "Multiply payload size by request rate, then convert units. 1 MB = 1,000 KB."
  },
  {
    id: 2,
    topic: "APIs",
    question: "You have 50,000 daily active users and each makes 200 requests/day spread over 8 active hours. What's the average requests/sec the API gateway must handle?",
    unit: "req/s",
    acceptableRange: [200, 520],
    referenceAnswer: 347,
    explanation: "50,000 users × 200 req/day = 10M req/day. Over 8 hours = 10M / 28,800s ≈ 347 req/s.",
    tip: "Average rate = total requests ÷ active seconds. For peak planning, multiply by a 2-3× factor."
  },
  {
    id: 3,
    topic: "APIs",
    question: "A GraphQL API batches queries. Each batch averages 4 sub-queries, and each sub-query takes 15 ms to resolve (run in parallel). If the overhead per batch is 5 ms, how many batched requests/sec can one server thread handle?",
    unit: "requests/sec",
    acceptableRange: [30, 70],
    referenceAnswer: 50,
    explanation: "Each batch takes 15 ms (parallel sub-queries) + 5 ms overhead = 20 ms. 1,000 ms / 20 ms = 50 requests/sec per thread.",
    tip: "Parallel execution means you take the max sub-query time, not the sum. Then add overhead."
  },

  // === Databases (3) ===
  {
    id: 4,
    topic: "Databases",
    question: "A PostgreSQL table has 500 million rows, each row is 200 bytes. How much disk space does the raw data need?",
    unit: "GB",
    acceptableRange: [60, 150],
    referenceAnswer: 100,
    explanation: "500M × 200 bytes = 100 × 10^9 bytes = 100 GB",
    tip: "Multiply row count by row size. 1 GB ≈ 10^9 bytes."
  },
  {
    id: 5,
    topic: "Databases",
    question: "A MongoDB cluster handles 20,000 writes/sec. If each write is 1 KB and you keep a write-ahead log, how much WAL data accumulates per hour?",
    unit: "GB",
    acceptableRange: [40, 110],
    referenceAnswer: 72,
    explanation: "20,000 × 1 KB × 3,600 sec = 72,000,000 KB = 72 GB/hour",
    tip: "Multiply write rate × write size × seconds-in-hour (3,600)."
  },
  {
    id: 6,
    topic: "Databases",
    question: "A SQL database can handle 5,000 transactions/sec on a single node. Your app needs 80,000 transactions/sec. How many database nodes do you need (assuming linear scaling)?",
    unit: "nodes",
    acceptableRange: [12, 24],
    referenceAnswer: 16,
    explanation: "80,000 / 5,000 = 16 nodes",
    tip: "Divide total required throughput by per-node capacity."
  },

  // === Scaling (3) ===
  {
    id: 7,
    topic: "Scaling",
    question: "Your web app gets 100M page views/day. Each page view makes 3 API calls. If traffic is spread over 18 active hours, what's the average API calls/sec?",
    unit: "thousand req/s",
    acceptableRange: [3, 8],
    referenceAnswer: 4.6,
    explanation: "100M × 3 = 300M API calls/day. 300M / (18 × 3,600) = 300M / 64,800 ≈ 4,630 calls/sec ≈ 4.6K req/s",
    tip: "Total calls = page views × calls per view. Divide by active seconds (hours × 3,600)."
  },
  {
    id: 8,
    topic: "Scaling",
    question: "A single app server handles 500 concurrent connections. At peak, you expect 15,000 concurrent users. How many app servers do you need?",
    unit: "servers",
    acceptableRange: [20, 45],
    referenceAnswer: 30,
    explanation: "15,000 / 500 = 30 servers",
    tip: "Divide total concurrent users by per-server concurrency limit."
  },
  {
    id: 9,
    topic: "Scaling",
    question: "You need to process 1 TB of log data daily using MapReduce. Each worker node processes 50 GB/hour. How many worker-hours are needed?",
    unit: "worker-hours",
    acceptableRange: [14, 30],
    referenceAnswer: 20,
    explanation: "1,000 GB / 50 GB per hour = 20 worker-hours",
    tip: "Convert TB to GB (1 TB = 1,000 GB), then divide by processing rate."
  },

  // === CAP Theorem (2) ===
  {
    id: 10,
    topic: "CAP Theorem",
    question: "A CP (consistent + partition-tolerant) database requires quorum writes. In a 5-node cluster, a write needs acknowledgment from a majority before success. If each node-ack takes 10 ms (parallel), what's the minimum write latency?",
    unit: "ms",
    acceptableRange: [8, 15],
    referenceAnswer: 10,
    explanation: "Quorum = majority of 5 = 3 nodes. Since acks are parallel, you wait for the 3rd fastest response. With uniform 10 ms latency, minimum = 10 ms.",
    tip: "Quorum = ⌊n/2⌋ + 1. Parallel acks mean you wait for the k-th fastest, not the sum."
  },
  {
    id: 11,
    topic: "CAP Theorem",
    question: "An AP (available + partition-tolerant) system allows eventual consistency. If the replication lag is 200 ms between 3 data centers, and a user reads immediately after writing, what's the probability of reading stale data if reads are randomly routed?",
    unit: "percent",
    acceptableRange: [50, 80],
    referenceAnswer: 67,
    explanation: "With 3 data centers, the write lands on 1 first. A random read has a 2/3 chance (~67%) of hitting a replica that hasn't received the update yet.",
    tip: "If there are N replicas and 1 has the latest write, the chance of stale read = (N-1)/N."
  },

  // === Web Auth & Security (2) ===
  {
    id: 12,
    topic: "Auth & Security",
    question: "bcrypt with cost factor 12 takes ~250 ms to hash one password. If your auth server has 4 cores, how many login attempts/sec can it handle?",
    unit: "logins/sec",
    acceptableRange: [10, 24],
    referenceAnswer: 16,
    explanation: "Each hash takes 250 ms = 4 hashes/sec per core. 4 cores × 4 = 16 logins/sec.",
    tip: "1,000 ms / hash_time = hashes per core per sec. Multiply by core count."
  },
  {
    id: 13,
    topic: "Auth & Security",
    question: "Your service validates 5,000 JWT tokens/sec. Each validation does an RSA-2048 signature check taking 0.1 ms. What % of a single CPU core does token validation consume?",
    unit: "percent",
    acceptableRange: [30, 75],
    referenceAnswer: 50,
    explanation: "5,000 × 0.1 ms = 500 ms of CPU time per second = 50% of one core.",
    tip: "Total CPU time = requests × per-request time. Divide by 1,000 ms to get fraction of one core."
  },

  // === Load Balancers (2) ===
  {
    id: 14,
    topic: "Load Balancers",
    question: "An L4 load balancer can handle 1 million concurrent TCP connections. If each connection averages 30 seconds, what's the max new-connection rate?",
    unit: "thousand conn/s",
    acceptableRange: [20, 50],
    referenceAnswer: 33,
    explanation: "If each connection lives 30s, and max concurrent is 1M, then steady-state new connections = 1M / 30 ≈ 33,333/s ≈ 33K conn/s.",
    tip: "New connection rate = max concurrent connections / average connection duration."
  },
  {
    id: 15,
    topic: "Load Balancers",
    question: "An L7 load balancer inspects HTTP headers, adding 0.5 ms of CPU time per request. If it handles 20,000 req/sec, how many CPU cores are needed just for header inspection?",
    unit: "cores",
    acceptableRange: [7, 15],
    referenceAnswer: 10,
    explanation: "20,000 × 0.5 ms = 10,000 CPU-ms per second = 10 full CPU cores worth.",
    tip: "Total CPU-ms/s = request rate × per-request CPU time. Divide by 1,000 to get cores."
  },

  // === Caching (3) ===
  {
    id: 16,
    topic: "Caching",
    question: "A Redis node has 64 GB RAM, average cached object is 2 KB (including key + overhead). How many objects can it store?",
    unit: "million objects",
    acceptableRange: [20, 45],
    referenceAnswer: 32,
    explanation: "64 GB / 2 KB = 64 × 10^9 / 2 × 10^3 = 32 × 10^6 = 32 million objects.",
    tip: "1 GB = 10^9 bytes, 1 KB = 10^3 bytes. Divide total memory by object size."
  },
  {
    id: 17,
    topic: "Caching",
    question: "Your cache has a 95% hit rate with 10 ms cache response time and 200 ms database response time. What's the average response time per request?",
    unit: "ms",
    acceptableRange: [15, 25],
    referenceAnswer: 19.5,
    explanation: "0.95 × 10 ms + 0.05 × 200 ms = 9.5 + 10 = 19.5 ms",
    tip: "Weighted average: (hit_rate × cache_time) + (miss_rate × db_time)."
  },
  {
    id: 18,
    topic: "Caching",
    question: "You have a Memcached cluster with 10 nodes, each handling 100K ops/sec. If one node fails, what ops/sec must each remaining node handle (assuming even redistribution)?",
    unit: "thousand ops/s",
    acceptableRange: [90, 140],
    referenceAnswer: 111,
    explanation: "Total = 10 × 100K = 1M ops/sec. After failure, 9 nodes share the load: 1M / 9 ≈ 111K ops/sec each.",
    tip: "Total throughput stays the same, just divide by (N-1) remaining nodes."
  },

  // === Message Queues (3) ===
  {
    id: 19,
    topic: "Message Queues",
    question: "A Kafka topic receives 50,000 messages/sec, each 1 KB. With a retention period of 7 days, how much storage does this topic need?",
    unit: "TB",
    acceptableRange: [20, 45],
    referenceAnswer: 30,
    explanation: "50,000 msg/s × 1 KB × 86,400 s/day × 7 days = 50,000 × 604,800,000 bytes ≈ 30.24 TB",
    tip: "Daily data = rate × size × 86,400. Multiply by retention days. Convert bytes to TB (÷ 10^12)."
  },
  {
    id: 20,
    topic: "Message Queues",
    question: "A message queue consumer processes 200 messages/sec. A sudden traffic spike produces 1 million messages in the queue. How long to drain the backlog?",
    unit: "minutes",
    acceptableRange: [55, 120],
    referenceAnswer: 83,
    explanation: "1,000,000 / 200 = 5,000 seconds ≈ 83 minutes",
    tip: "Backlog drain time = queue depth ÷ consumer throughput."
  },
  {
    id: 21,
    topic: "Message Queues",
    question: "You partition a Kafka topic into 12 partitions. Each partition is consumed by one consumer. If each consumer processes 5,000 msg/sec, what's the topic's total throughput?",
    unit: "thousand msg/s",
    acceptableRange: [40, 85],
    referenceAnswer: 60,
    explanation: "12 partitions × 5,000 msg/sec = 60,000 msg/sec = 60K msg/s",
    tip: "Total throughput = number of partitions × per-partition consumer rate."
  },

  // === Indexing (2) ===
  {
    id: 22,
    topic: "Indexing",
    question: "A B-tree index on a table with 1 billion rows has a branching factor of 1,000. How many levels does the tree need to reach any row?",
    unit: "levels",
    acceptableRange: [3, 4],
    referenceAnswer: 3,
    explanation: "1,000^3 = 10^9 = 1 billion. So 3 levels suffice.",
    tip: "B-tree levels = ⌈log_b(N)⌉ where b is branching factor."
  },
  {
    id: 23,
    topic: "Indexing",
    question: "A full-text search index (inverted index) for 10 million documents averages 500 unique terms per document. If each posting (doc_id) is 8 bytes, how large is the postings list?",
    unit: "GB",
    acceptableRange: [25, 60],
    referenceAnswer: 40,
    explanation: "10M docs × 500 terms × 8 bytes = 40 × 10^9 bytes = 40 GB",
    tip: "Total postings = documents × terms per doc. Multiply by bytes per posting."
  },

  // === Failovers (2) ===
  {
    id: 24,
    topic: "Failovers",
    question: "Your SLA promises 99.99% uptime. How many minutes of downtime are allowed per year?",
    unit: "minutes",
    acceptableRange: [35, 70],
    referenceAnswer: 52.6,
    explanation: "525,600 min/year × 0.0001 = 52.56 minutes",
    tip: "Minutes/year = 365.25 × 24 × 60 ≈ 525,600. Multiply by (1 - uptime %)."
  },
  {
    id: 25,
    topic: "Failovers",
    question: "A primary-secondary database setup detects primary failure in 5 sec and promotes a secondary in 10 sec. If the system handles 2,000 writes/sec, how many writes are lost in the worst case (assuming async replication with 3 sec lag)?",
    unit: "thousand writes",
    acceptableRange: [4, 9],
    referenceAnswer: 6,
    explanation: "Replication lag of 3 sec means up to 3 sec of writes may not have reached secondary. But detection takes 5 sec, so total gap ≈ 3 sec of un-replicated writes. 2,000 × 3 = 6,000 writes lost.",
    tip: "Lost writes = write rate × replication lag. The detection/promotion time affects availability, not data loss."
  },

  // === Replication (3) ===
  {
    id: 26,
    topic: "Replication",
    question: "A database has 500 GB of data and you're setting up a new replica. The network link is 1 Gbps. How long does the initial replication take?",
    unit: "minutes",
    acceptableRange: [45, 100],
    referenceAnswer: 67,
    explanation: "500 GB = 4,000 Gbit. At 1 Gbps = ~4,000 seconds ≈ 67 minutes.",
    tip: "Convert GB to Gbit (×8), divide by bandwidth in Gbps."
  },
  {
    id: 27,
    topic: "Replication",
    question: "You have 3 replicas with synchronous replication. Each write requires all 3 to acknowledge. If each replica is in a different region with 50 ms, 100 ms, and 150 ms round-trip latencies, what's the write latency?",
    unit: "ms",
    acceptableRange: [100, 200],
    referenceAnswer: 150,
    explanation: "Synchronous replication waits for ALL replicas. The slowest is 150 ms, so write latency = 150 ms.",
    tip: "Synchronous = wait for slowest. Quorum = wait for k-th fastest."
  },
  {
    id: 28,
    topic: "Replication",
    question: "A multi-leader replication setup has 4 leaders. Each leader handles 1,000 writes/sec and must replicate to the other 3. How many replication messages/sec flow across the entire system?",
    unit: "thousand msg/s",
    acceptableRange: [8, 18],
    referenceAnswer: 12,
    explanation: "Each leader sends its 1,000 writes to 3 others = 3,000 replication msg/s per leader. 4 leaders × 3,000 = 12,000 msg/s = 12K msg/s.",
    tip: "Each leader replicates to (N-1) others. Total = N × writes_per_leader × (N-1)."
  },

  // === Consistent Hashing (2) ===
  {
    id: 29,
    topic: "Consistent Hashing",
    question: "A consistent hash ring has 6 physical nodes, each with 150 virtual nodes. If one physical node is removed, what percentage of keys need to be remapped?",
    unit: "percent",
    acceptableRange: [12, 22],
    referenceAnswer: 16.7,
    explanation: "With consistent hashing, removing 1 of 6 nodes remaps ~1/6 of keys ≈ 16.7%. Virtual nodes ensure even distribution.",
    tip: "In consistent hashing, removing 1 of N nodes remaps ~1/N of keys."
  },
  {
    id: 30,
    topic: "Consistent Hashing",
    question: "You have 10 cache nodes on a consistent hash ring with 100 virtual nodes each. Total keyspace has 5 million keys. On average, how many keys does each physical node hold?",
    unit: "thousand keys",
    acceptableRange: [350, 700],
    referenceAnswer: 500,
    explanation: "5,000,000 keys / 10 nodes = 500,000 keys per node = 500K keys.",
    tip: "Virtual nodes improve uniformity. With enough vnodes, each physical node holds ~total_keys/N."
  }
];
