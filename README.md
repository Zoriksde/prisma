# Prisma - Home Assignment

# Before running the application

Please install all required libraries using `npm install`.

# How to run application?

Running the application requires the database to be up. Use `docker compose up -d` to run the postgres database
in the container.

Once the container run successfully, use `npm run start:dev` to run the application in development mode, or
`npm run start` if you want to run the application in "production" mode.

# Questions

### What were some of the reasons you chose the technology stack that you did?

I have chosen the following technology stack due to couple of reasons.

NestJS is a framework in the NodeJS environment. Such enviroment provides a lot of packages and external libraries, it's one of the most popular runtime environments which is constantly maintainble. The popularity makes it
highly reliable, as people take care of the libraries, fix the bugs and issues. Also some common problems are already solved in some libraries or external packages, which reduces the overall development effort.

NestJS is built on top of ExpressJS and NodeJS. This makes such framework great for writing scalable applications,
the overall NodeJS architecture allows for non-blocking I/O operations, and it can effectively manage huge workload.

NestJS imposes certain good coding practices, while it's not always possible to do something on your own (due to NestJS limitations), it provides a great boilerplate for writing good quality code. It encapsulates some commonly used
design patterns and principles, which makes coding much simpler.

NestJS works great with TypeScript, which forces us to write type safe code.

I'm familar with such technologies :D

### What were some of the trade-offs you made when building this application? Why were these acceptable trade-offs?

Some of the trade-offs I was thiniking about:

Simplicity vs Flexibility:
Certain solutions are definitely simpler, but we're paying the cost of less flexibility. For example using TypeORM
may speed up our development process, but it can limit flexibility of the application. For most of the use cases
TypeORM definitely fulfills the requirements, however in some specific cases it does not work
so well. However due to nature of this application, I didn't want to overengineer the software, thus I used TypeORM for
this application (as it fulfills requirements).

Maintainability vs Complexity:
Highly maintainable code is easier to understand, but often it requires more complex patterns or concepts
to implement. The overall boilerplate is initially slightly more complex in case of writing highly maintainable code. I was thinking about standard 3-layered application and clean architecture, and decided to implement it within clean architecture principles, to improve the code maintainability (I know it's a basic application, but thinking about different problems in the future - e.g changing the database etc. made me use clean architecture principles)

Data Integrity vs Simplicity:
Working with data often requires understanding the domain and business context. I was thinking about creating
a basic data models (single data model for whole application) and more sophisticated solution (using transactional boundaries, unit of work, mapping functions between database and domain layers etc.). Introducing more complex patterns to work with data can result in spending more time during development process, but I've decided to focus on some data integrity patterns to provide more consistent data.

### Given more time, what improvements or optimizations would you want to add? When would you add them?

I would definitely add below improvemnts or optimizations:

Adding observability tools (logs, metrics, traces etc.), using application performance mangement tools. It would allow
us to look into the details of some requests, analysing the latency of API calls, working with charts which would tell us
different statistics about our application (e.g number of successfull calls, percentage of issues, some common patterns etc.). I would add it when my application would go to production, as observability tools are pretty expensive, and there's no great value added of them at the development stage.

I would improve error handling, providing some exception filters, mapping the exceptions to appropriate HTTP responses,
working with different HTTP status codes. This step could be done right now, when application is being developed.

Adding some security features like authentication, authorization, RBAC, rate limiters and throttling mechanisms, providing
HTTPS connection (via SSL / TLS certificates). Such security features would improve the reliability of our application and would reduce the likelihood of some incident happening. This step is critical before application would go public, so it would be probably a time to introduce it.

I would improve the API endpoints by providing the pagination of data, serializing API responses, versioning of API etc. This step could be done right now, during the development stage.

I would definitely focus on writing different kind of tests (unit, integration, e2e, user acceptance tests or regression tests). I'm a big fan of TDD, thus I would definitely write such tests at the stage of development.

### What would you need to do to make this application scale to hundreds of thousands of users?

To make application more scalable I would:

Introduce more scalable patterns like CQRS (instead of CRUD). It would allow me to scale write and read actions in
isolation (e.g using different database engines, table indexes etc.). We could use master database to handle write requests and read replicas to handle read requests.

Introduce some in-memory caching for frequently accessed resources. We would avoid calling database every time the request
is being triggered.

As the application does not need to maintain any state, it would be easy to scale it horizontally. We could create
some configuration for microservice to scale automatically, based on the network traffic, CPU usage, memory usage etc.
Such microservice instaces would be behind the load balancer, which would also allow for distributing the traffic in some
optimized way.

Instances could also be scaled vertically, by providing better resources (e.g CPU, memory, disk storage etc.), however
vertical scaling has its own limitations, which is not the case for horizontal one.

If the data would grow significantly, we could use database sharding, providing different instances for different
regions etc. It would allow for spreading the load accross different geographical areas. We could also regulary archive
the obsolate data to improve query performance and reduce storage usage and costs.

### How would you change the architecture to allow for models that are stored in different databases? E.g. posts are stored in Cassandra and blogs are stored in Postgres.

The persistance layer does not impact any another layer, thus there wouldn't be much changes in the application. We would need to create a repository which would handle couple of connections and perform some database opertions. We would need to
use Unit Of Work pattern to work with the transactional data. This would ensure the consistency and integrity of our data. It would require some effort in the infrastructure layer, however it's still black-boxed for other kind of layers. (Application layer wouldn't even know that there are two databases)

### How would you deploy the Architecture you designed in a production ready way?

I would use automated CI/CD pipelines (e.g GHA) to test and deploy my application to production. Such pipeline would be integrated with some external cloud provider (e.g AWS). We could use some IaC tool (e.g Terraform) to provide the configuration of services. I would use some containerized service like (Amazon ECS and Amazon ECR) to push new application image, tag and deploy it to ECS instance. AWS would allow us for rollbacking the application version, working with canary deployments, maintaining the application versions history.
