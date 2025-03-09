// const example = [
//   {
//     description:
//       "This architecture uses Cloud Run to host a serverless application and Firestore to store data. Cloud Load Balancing is used to distribute traffic, and Cloud DNS is used to manage domain names. App Engine provides a scalable backend.",
//     diagram:
//       "```mermaid\ngraph LR\n    subgraph Google Cloud Platform\n        loadbalanc[Cloud Load Balancing] --> clouddns(Cloud DNS)\n        clouddns --> appen(App Engine)\n        appen --> cloudrun[Cloud Run]\n        cloudrun --> firest[Firestore]\n    end\n```",
//     runningCost: "Monthly cost: $50 - $100",
//     terraform:
//       '```terraform\nresource "google_cloud_run_service" "default" {\n  name     = "my-cloud-run-service"\n  location = "us-central1"\n\n  template {\n    spec {\n      containers {\n        image = "us-docker.pkg.dev/cloudrun/container/hello"\n      }\n    }\n  }\n\n  traffic {\n    percent         = 100\n    latest_revision = true\n  }\n}\n\nresource "google_firestore_database" "default" {\n  name     = "(default)"\n  location = "us-central1"\n  type     = "firestore-native"\n}\n\nresource "google_app_engine_application" "default" {\n  location_id = "us-central"\n  database_type = "CLOUD_FIRESTORE"\n}\n```',
//     title: "Serverless Architecture",
//   },
//   {
//     description:
//       "This architecture uses Compute Engine to provision virtual machines and Cloud Load Balancing to distribute traffic. Cloud SQL is used to manage relational databases, and Cloud DNS is used to manage domain names. Cloud Storage is used to host static content.",
//     diagram:
//       "```mermaid\ngraph LR\n    subgraph Google Cloud Platform\n        loadbalanc[Cloud Load Balancing] --> clouddns(Cloud DNS)\n        clouddns --> computeengine[Compute Engine]\n        computeengine --> cloudsql[Cloud SQL]\n        computeengine --> cloudstorage[Cloud Storage]\n    end\n```",
//     runningCost: "Monthly cost: $100 - $200",
//     terraform:
//       '```terraform\nresource "google_compute_instance" "default" {\n  name         = "my-compute-instance"\n  machine_type = "e2-medium"\n  zone         = "us-central1-a"\n\n  boot_disk {\n    initialize_params {\n      image = "debian-cloud/debian-11"\n    }\n  }\n\n  network_interface {\n    network = "default"\n    access_config {\n    }\n  }\n}\n\nresource "google_sql_database_instance" "default" {\n  name             = "my-cloud-sql-instance"\n  region           = "us-central1"\n  database_version = "MYSQL_8_0"\n  settings {\n    tier = "db-f1-micro"\n  }\n}\n\nresource "google_storage_bucket" "default" {\n  name          = "unique-bucket-name"\n  location      = "US"\n  force_destroy = true\n}\n```',
//     title: "Virtual Machine-based Architecture",
//   },
//   {
//     description:
//       "This architecture uses Cloud Functions to build an event-driven application and Firestore to store data. Cloud Load Balancing is used to distribute traffic, and Cloud DNS is used to manage domain names. Cloud Pub/Sub is used to implement a message queue.",
//     diagram:
//       "```mermaid\ngraph LR\n    subgraph Google Cloud Platform\n        loadbalanc[Cloud Load Balancing] --> clouddns(Cloud DNS)\n        clouddns --> Cloudfun[Cloud Functions]\n        Cloudfun --> firest[Firestore]\n        Cloudfun --> pubsub[Cloud Pub/Sub]\n    end\n```",
//     runningCost: "Monthly cost: $30 - $80",
//     terraform:
//       '```terraform\nresource "google_cloudfunctions2_function" "default" {\n  name        = "my-cloud-function"\n  location    = "us-central1"\n  description = "A function that triggers from pubsub"\n\n  build_config {\n    runtime     = "nodejs16"\n    entry_point = "helloGET"\n    source {\n      storage_source {\n        bucket = "your-bucket-name"\n        object = "archive.zip"\n      }\n    }\n  }\n\n  service_config {\n    max_instance_count = 3\n    min_instance_count = 1\n    available_memory   = "256M"\n    timeout_seconds    = 60\n  }\n}\n\nresource "google_pubsub_topic" "default" {\n  name = "my-topic"\n}\n```',
//     title: "Event-Driven Architecture",
//   },
// ];

// const example = [
//   {
//     description:
//       "This architecture uses App Engine to host an application, Cloud Firestore to store data, and Cloud Functions to execute backend processing. App Engine automatically scales to handle increased traffic. Cloud Firestore is a NoSQL database that is fast and scalable. Cloud Functions can be used to execute event-driven backend processing.",
//     diagram:
//       "```mermaid\nflowchart TD\n    subgraph Google Cloud Platform\n        A[Mobile App] --> B(Cloud Load Balancing)\n        B --> C{App Engine}\n        C --> D[Cloud Firestore]\n        C --> E[Cloud Functions]\n    end\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n```",
//     runningCost:
//       "Monthly cost: $50 - $200",
//     terraform:
//       '```terraform\nresource "google_app_engine_application" "app" {\n  project     = "your-project-id"\n  location_id = "us-central"\n}\n\nresource "google_firestore_database" "default" {\n  project     = "your-project-id"\n  name     = "(default)"\n  location_id = "us-central"\n  type = "NATIVE"\n}\n\n\nresource "google_cloudfunctions2_function" "function" {\n  project     = "your-project-id"\n  name        = "function-example"\n  location    = "us-central1"\n  build_config {\n    runtime     = "nodejs16"\n    entry_point = "helloHttp"\n    source {\n      storage_source {\n        bucket = "your-bucket-name"\n        object = "function-source.zip"\n      }\n    }\n  }\n  service_config {\n    max_instance_count = 5\n    min_instance_count = 1\n    available_memory   = "256M"\n    timeout_seconds    = 60\n  }\n}\n```',
//     title:
//       "Serverless Architecture using App Engine, Cloud Firestore, and Cloud Functions",
//   },
//   {
//     description:
//       "This architecture uses Compute Engine to host an application and Cloud SQL to store data. Compute Engine provides virtual machines that can be flexibly configured. Cloud SQL is a managed relational database service that supports MySQL, PostgreSQL, and SQL Server.",
//     diagram:
//       "```mermaid\nflowchart TD\n    subgraph Google Cloud Platform\n        A[Mobile App] --> B(Cloud Load Balancing)\n        B --> C(Compute Engine)\n        C --> D[Cloud SQL]\n    end\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n```",
//     runningCost:
//       "Monthly costs vary depending on Compute Engine instance size, Cloud SQL database size, and network traffic, but are estimated to be approximately $100 - $500.",
//     terraform:
//       '```terraform\nresource "google_compute_instance" "default" {\n  project      = "your-project-id"\n  name         = "vm-instance"\n  machine_type = "e2-medium"\n  zone         = "us-central1-a"\n\n  boot_disk {\n    initialize_params {\n      image = "debian-cloud/debian-11"\n    }\n  }\n\n  network_interface {\n    network = "default"\n\n    access_config {\n    }\n  }\n}\n\nresource "google_sql_database_instance" "default" {\n  project             = "your-project-id"\n  name                = "sql-instance"\n  region              = "us-central1"\n  database_version  = "MYSQL_8_0"\n  settings {\n    tier = "db-f1-micro"\n  }\n  deletion_protection  = false\n}\n```',
//     title: "Virtual Machine Architecture using Compute Engine and Cloud SQL",
//   },
//   {
//     description:
//       "This architecture uses Kubernetes Engine (GKE) to host an application and Cloud Spanner to store data. GKE is a managed Kubernetes service that can deploy, scale, and manage containerized applications. Cloud Spanner is a globally distributed, scalable, and consistent database service.",
//     diagram:
//       "```mermaid\nflowchart TD\n    subgraph Google Cloud Platform\n        A[Mobile App] --> B(Cloud Load Balancing)\n        B --> C(Kubernetes Engine)\n        C --> D[Cloud Spanner]\n    end\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n```",
//     runningCost:
//       "Monthly cost: $500 - $2000",
//     terraform:
//       '```terraform\nresource "google_container_cluster" "primary" {\n  project = "your-project-id"\n  name     = "gke-cluster"\n  location = "us-central1-a"\n  initial_node_count = 1\n}\n\nresource "google_spanner_instance" "default" {\n  project = "your-project-id"\n  name             = "spanner-instance"\n  config           = "regional-us-central1"\n  display_name     = "Test Spanner Instance"\n  num_nodes        = 1\n}\n```',
//     title:
//       "Container Orchestration Architecture using Kubernetes Engine (GKE) and Cloud Spanner",
//   },
// ];

const checkInSystem = [
  {
    description:
      "This architecture uses Cloud Functions, Firestore, and Cloud Scheduler to build a scalable and cost-effective attendance system. Cloud Functions executes backend logic such as user authentication, attendance recording, and report generation. Firestore stores attendance data, user data, and other system data. Cloud Scheduler schedules periodic tasks (such as report generation).",
    diagram:
      "graph LR\n    subgraph Google Cloud Platform\n        A[Cloud Functions] --> B(Firestore)\n        C[Cloud Scheduler] --> A\n        D[Identity Platform] --> A\n        E[Cloud Storage] --> A\n        F[BigQuery] --> A\n        style A fill:#fff,stroke:#bbb,stroke-width:2px\n        style B fill:#fff,stroke:#bbb,stroke-width:2px\n        style C fill:#fff,stroke:#bbb,stroke-width:2px\n        style D fill:#fff,stroke:#bbb,stroke-width:2px\n        style E fill:#fff,stroke:#bbb,stroke-width:2px\n        style F fill:#fff,stroke:#bbb,stroke-width:2px\n    end\n    subgraph Users\n        U[Users] --> D\n        U --> G[Web/Mobile App]\n        G --> A\n    end",
    runningCost: "Monthly cost: $150",
    terraform:
      'resource "google_cloudfunctions_function" "attendance_function" {\n  name        = "attendance-function"\n  description = "Cloud Function for attendance management"\n  runtime     = "nodejs16"\n\n  available_memory_mb = 256\n  source_archive_bucket = "your-bucket-name"\n  source_archive_object = "function-source.zip"\n  trigger_http = true\n\n  ingress_settings = "ALLOW_ALL"\n}\n\nresource "google_firestore_database" "default" {\n  name     = "(default)"\n  project  = "your-project-id"\n  location = "us-central"\n  type     = "firestore-native"\n}\n\nresource "google_cloudscheduler_job" "attendance_report" {\n  name             = "attendance-report-job"\n  description      = "Generates daily attendance report"\n  schedule         = "0 9 * * *"\n  time_zone        = "America/Los_Angeles"\n  project          = "your-project-id"\n\n  http_target {\n    http_method = "POST"\n    uri         = "${google_cloudfunctions_function.attendance_function.https_trigger_url}"\n  }\n}',
    title: "Attendance System using Cloud Functions and Firestore",
  },
  {
    description:
      "This architecture uses App Engine, Cloud SQL, and Cloud Storage to build a more traditional attendance system. App Engine executes the frontend and backend logic. Cloud SQL stores attendance data, user data, and other system data. Cloud Storage stores reports and other files.",
    diagram:
      "graph LR\n    subgraph Google Cloud Platform\n        A[App Engine] --> B(Cloud SQL)\n        A --> C(Cloud Storage)\n        D[Identity Platform] --> A\n        E[Cloud Logging] --> A\n        style A fill:#fff,stroke:#bbb,stroke-width:2px\n        style B fill:#fff,stroke:#bbb,stroke-width:2px\n        style C fill:#fff,stroke:#bbb,stroke-width:2px\n        style D fill:#fff,stroke:#bbb,stroke-width:2px\n        style E fill:#fff,stroke:#bbb,stroke-width:2px\n    end\n    subgraph Users\n        U[Users] --> D\n        U --> F[Web/Mobile App]\n        F --> A\n    end",
    runningCost: "Monthly cost: $250",
    terraform:
      'resource "google_app_engine_application" "app" {\n  project  = "your-project-id"\n  location = "us-central"\n}\n\nresource "google_sql_database_instance" "default" {\n  name             = "attendance-db"\n  region           = "us-central1"\n  database_version = "MYSQL_8_0"\n  settings {\n    tier = "db-f1-micro"\n  }\n  project = "your-project-id"\n  deletion_protection  = false\n}\n\nresource "google_storage_bucket" "bucket" {\n  name          = "your-unique-bucket-name"\n  location      = "US"\n  force_destroy = true\n}',
    title: "Attendance System using App Engine and Cloud SQL",
  },
  {
    description:
      "This architecture uses Compute Engine, Cloud Load Balancing, and Cloud SQL to build a more advanced attendance system. Compute Engine executes the frontend and backend logic. Cloud Load Balancing distributes traffic to Compute Engine instances. Cloud SQL stores attendance data, user data, and other system data.",
    diagram:
      "graph LR\n    subgraph Google Cloud Platform\n        A[Compute Engine] --> B(Cloud SQL)\n        C[Cloud Load Balancing] --> A\n        D[Identity Platform] --> A\n        E[Cloud Monitoring] --> A\n        style A fill:#fff,stroke:#bbb,stroke-width:2px\n        style B fill:#fff,stroke:#bbb,stroke-width:2px\n        style C fill:#fff,stroke:#bbb,stroke-width:2px\n        style D fill:#fff,stroke:#bbb,stroke-width:2px\n        style E fill:#fff,stroke:#bbb,stroke-width:2px\n    end\n    subgraph Users\n        U[Users] --> D\n        U --> F[Web/Mobile App]\n        F --> C\n    end",
    runningCost: "Monthly cost: $400",
    terraform:
      'resource "google_compute_network" "vpc_network" {\n  name                    = "attendance-vpc"\n  auto_create_subnetworks = false\n  project                 = "your-project-id"\n}\n\nresource "google_compute_firewall" "firewall" {\n  name    = "attendance-firewall"\n  network = google_compute_network.vpc_network.name\n  allow {\n    protocol = "tcp"\n    ports    = ["80", "443", "22"]\n  }\n  project = "your-project-id"\n}\n\nresource "google_compute_instance" "default" {\n  name         = "attendance-vm"\n  machine_type = "e2-medium"\n  zone         = "us-central1-a"\n  project      = "your-project-id"\n  boot_disk {\n    initialize_params {\n      image = "debian-cloud/debian-11"\n    }\n  }\n  network_interface {\n    network = google_compute_network.vpc_network.name\n    access_config {\n    }\n  }\n}',
    title: "Attendance System using Compute Engine and Cloud Load Balancing",
  },
];

const example = [
  {
    description:
      "This architecture uses Cloud Run to host a game server and Cloud SQL to store game data. Cloud Monitoring and Cloud Logging are used for monitoring and logging the server. Cloud Load Balancing distributes traffic to multiple Cloud Run instances.",
    diagram:
      "```mermaid\ngraph LR\n    A[User] --> B(Cloud Load Balancing)\n    B --> C{Cloud Run}\n    C --> D[(Cloud SQL)]\n    E[Cloud Monitoring] -- Monitoring --> C\n    F[Cloud Logging] -- Logging --> C\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n```",
    runningCost: "Monthly cost: $500",
    terraform:
      '```terraform\nresource "google_cloud_run_v2_service" "default" {\n  name     = "game-server"\n  location = "us-central1"\n\n  template {\n    containers {\n      image = "us-docker.pkg.dev/cloudrun/container/hello"\n    }\n  }\n\n  traffic {\n    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"\n    percent = 100\n  }\n}\n\nresource "google_sql_database_instance" "default" {\n  name             = "game-db"\n  region           = "us-central1"\n  database_version = "MYSQL_8_0"\n  settings {\n    tier = "db-f1-micro"\n  }\n}\n\nresource "google_monitoring_uptime_check_config" "default" {\n  display_name = "Game Server Uptime Check"\n  host_name    = "game-server.example.com" # Replace with your Cloud Run service URL\n  period       = "300s"\n  timeout      = "60s"\n  http_check {\n    path = "/health"\n    port = 80\n  }\n  monitored_resource {\n    type = "uptime_url"\n  }\n}\n\nresource "google_logging_metric" "error_count" {\n  name        = "error-count"\n  description = "Counts error logs from the game server"\n  filter      = "resource.type=\\"cloud_run_revision\\" AND severity>=ERROR"\n  metric_descriptor {\n    metric_kind = "COUNTER"\n    value_type  = "INT64"\n  }\n}\n```',
    title: "Mobile Game Server using Cloud Run and Cloud SQL",
  },
  {
    description:
      "This architecture uses Compute Engine to host a game server and Firestore to store game data. Cloud Monitoring and Cloud Logging are used for monitoring and logging the server. The Global Load Balancer distributes traffic to multiple Compute Engine instances.",
    diagram:
      "```mermaid\ngraph LR\n    A[User] --> B(Global Load Balancer)\n    B --> C((Compute Engine))\n    C --> D[Firestore]\n    E[Cloud Monitoring] -- Monitoring --> C\n    F[Cloud Logging] -- Logging --> C\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n```",
    runningCost: "Monthly cost: $700",
    terraform:
      '```terraform\nresource "google_compute_instance" "default" {\n  name         = "game-server-vm"\n  machine_type = "e2-medium"\n  zone         = "us-central1-a"\n\n  boot_disk {\n    initialize_params {\n      image = "debian-cloud/debian-11"\n    }\n  }\n\n  network_interface {\n    network = "default"\n    access_config {\n    }\n  }\n\n  metadata = {\n    startup-script = "#!/bin/bash\\napt-get update\\napt-get install -y nginx\\nsystemctl start nginx"\n  }\n}\n\nresource "google_firestore_database" "default" {\n  name     = "default"\n  location = "us-central1"\n  type     = "FIRESTORE_NATIVE"\n}\n\nresource "google_monitoring_uptime_check_config" "default" {\n  display_name = "Game Server Uptime Check"\n  host_name    = "game-server-vm.us-central1-a.c.PROJECT_ID.internal" # Replace with your Compute Engine instance internal IP\n  period       = "300s"\n  timeout      = "60s"\n  http_check {\n    path = "/"\n    port = 80\n  }\n  monitored_resource {\n    type = "uptime_url"\n  }\n}\n\nresource "google_logging_metric" "error_count" {\n  name        = "error-count"\n  description = "Counts error logs from the game server"\n  filter      = "resource.type=\\"gce_instance\\" AND severity>=ERROR"\n  metric_descriptor {\n    metric_kind = "COUNTER"\n    value_type  = "INT64"\n  }\n}\n```',
    title: "Compute Engine and Firestore for mobile game server",
  },
  {
    description:
      "This architecture uses Google Kubernetes Engine (GKE) to host a game server and Cloud Spanner to store game data. Cloud Monitoring and Cloud Logging are used for monitoring and logging the server. Cloud Load Balancing distributes traffic to multiple GKE pods.",
    diagram:
      "```mermaid\ngraph LR\n    A[User] --> B(Cloud Load Balancing)\n    B --> C{{GKE}}\n    C --> D((Cloud Spanner))\n    E[Cloud Monitoring] -- Monitoring --> C\n    F[Cloud Logging] -- Logging --> C\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n```",
    runningCost: "Monthly cost: $1000",
    terraform:
      '```terraform\nresource "google_container_cluster" "default" {\n  name     = "game-cluster"\n  location = "us-central1"\n  initial_node_count = 1\n\n  node_config {\n    machine_type = "e2-medium"\n  }\n}\n\nresource "google_spanner_instance" "default" {\n  name             = "game-spanner"\n  config           = "regional-us-central1"\n  display_name     = "Game Spanner Instance"\n  num_nodes        = 1\n}\n\nresource "google_monitoring_uptime_check_config" "default" {\n  display_name = "Game Server Uptime Check"\n  host_name    = "game-server.example.com" # Replace with your GKE service URL\n  period       = "300s"\n  timeout      = "60s"\n  http_check {\n    path = "/health"\n    port = 80\n  }\n  monitored_resource {\n    type = "uptime_url"\n  }\n}\n\nresource "google_logging_metric" "error_count" {\n  name        = "error-count"\n  description = "Counts error logs from the game server"\n  filter      = "resource.type=\\"k8s_container\\" AND severity>=ERROR"\n  metric_descriptor {\n    metric_kind = "COUNTER"\n    value_type  = "INT64"\n  }\n}\n```',
    title: "Mobile Game Server using GKE and Cloud Spanner",
  },
];

const examples = {
  checkInSystem: checkInSystem,
  game: example,
};
export default examples;
