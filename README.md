# Platform for AI (PAI)

## Introduction

The system is a cluster management tool and resource scheduling platform that supports AI jobs (primarily deep learning jobs)
running on a GPU cluster.

The platform provides a set of interfaces to support major deep learning frameworks: CNTK, TensorFlow, etc. 
The interface is also extensible: new deep learning framework (or other type of workload) can be supported by the interface with 
a few extra lines of script and/or Python code.

The system supports GPU scheduling, a requirement of deep learning job. 
For better performance, it supports fine-grained topology-aware job placement.

The system embraces a [microservices](https://en.wikipedia.org/wiki/Microservices) architecture: every component runs in a container.
The system leverages [Kubernetes](https://kubernetes.io/) to deploy and manage key components in the system in a static way.
The more dynamic deep learning jobs are scheduled and managed by [Hadoop](http://hadoop.apache.org/) YARN with our [GPU enhancement](https://issues.apache.org/jira/browse/YARN-7481). 
The training data and training results are stored in Hadoop HDFS.
 
## System Deployment

### Prerequisite

The system runs on a cluster of machines each equipped with one or multiple GPUs. 
Each machine in the cluster runs Ubuntu 16.04 LTS and has a statically assigned IP address.
To deploy services, the system further relies on a Docker registry service (e.g., [Docker hub](https://docs.docker.com/docker-hub/)) 
to store the docker images for the services to be deployed.
The system also requires a dev machine that runs in the same environment and has full access to the cluster.

### Deployment process
To deploy and use the system, the process consists of the following steps.

1. [Deploy Kubernetes](./kubernetes-deployment/README.md)
2. Build the binary for [Hadoop AI](./hadoop-ai/README.md) and place it in the specified path* 
3. [Deploy system services](./service-deployment/README.md) using Kubernetes
4. Access [web portal](./webportal/README.md) for job submission and cluster management

\* If step 2 is skipped, a standard Hadoop 2.7.2 will be installed instead.

#### Kubernetes deployment

The platform leverages Kubernetes (k8s) to deploy and manage services.
To deploy k8s on the cluster, please refer to k8s deployment [readme](./kubernetes-deployment/README.md) for details.

#### Service deployment

After Kubernetes is deployed, the system will leverage some built-in k8s features (e.g., configmap) to deploy system services.
Please refer to service deployment [readme](./service-deployment/README.md) for details.

#### Job management

After system services have been deployed, user can access the web portal, a Web UI, for cluster management and job management.
Please refer to this [tutorial](job-tutorial/README.md) for details about job submission.

#### Cluster management

The web portal also provides Web UI for cluster management.

## System Architecture

<p style="text-align: left;">
  <img src="./sysarch.png" title="System Architecture" alt="System Architecture" />
</p>

The system architecture is illustrated above. 
User submits jobs or monitors cluster status through the [Web Portal](./webportal/README.md), 
which calls APIs provided by the [REST server](./rest-server/README.md).
Third party tools can also call REST server directly for job management.
Upon receiving API calls, the REST server coordinates with [FrameworkLauncher (short for Launcher)](./frameworklauncher/README.md)
to perform job management.
The Launcher Server handles requests from REST Server and submit jobs to Hadoop YARN. 
The job, if scheduled by YARN with [GPU enhancement](https://issues.apache.org/jira/browse/YARN-7481), 
can leverage GPUs in the cluster for deep learning computation. Other type of CPU based AI workloads or traditional big data job
can also run in the platform, coexisted with those GPU-based jobs. 
The platform leverages HDFS can storage data. All jobs are assumed to support HDFS.
All the static services (blue-lined box) are managed by Kubernetes. While jobs (purple-lined box) are managed by Hadoop YARN. 

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
