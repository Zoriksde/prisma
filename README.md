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

NestJS is a framework in the NodeJS environment. Such environment provides a lot of packages and external libraries, it's one of the most popular runtime environments which is constantly maintainble. Its popularity makes it highly reliable, as people take care of the libraries, fix the bugs and issues. Also some common problems are already solved in some libraries or external packages, which reduces the overall development effort.

NestJS is built on top of ExpressJS and NodeJS. This makes such framework great for writing scalable applications,
the overall NodeJS architecture allows for non-blocking I/O operations, and it can effectively manage huge workload.

NestJS imposes certain good coding practices, while it's not always possible to do something on your own (due to NestJS limitations), it provides a great boilerplate for writing good quality code. It encapsulates some commonly used design patterns and principles, which makes coding much simpler and it results in more maintainable code.

NestJS works great with TypeScript, which imposes type safe coding.

And finally I'm familar with such technologies :D

### What were some of the trade-offs you made when building this application? Why were these acceptable trade-offs?

Some of the trade-offs I was thiniking about:

Simplicity vs Flexibility:

Certain solutions are definitely simpler, but we're paying the cost of less flexibility. For example using TypeORM may speed up our development process, but it can limit flexibility of the application. For most of the use cases TypeORM fulfills the requirements, however in some specific cases it does not work so well. However due to nature of this application, I didn't want to perform software overengineering, thus I used TypeORM for this application, as it fulfills given requirements, and there's no need for additional flexibility in this area. 

Maintainability vs Complexity:

Highly maintainable code is easier to understand, but often it requires more complex patterns or concepts to use. In case of writing highly maintainable code the overall boilerplate is more complex. I was thinking about standard 3-layered application and clean architecture, and decided to implement it using clean architecture principles. This way I'm improving the code maintainability (I know it's a basic application, but thinking about different problems in the future - e.g changing the database etc. made me use clean architecture principles), with some acceptable complexity overage.

DDD Modeling vs Standard Models:

I was thinking about different approaches to model the business layer. Comparing the standard models (single class per each entity without sophisticated logic for mapping, data-centric classes with behavior declared in outer layers) to domain models (couple of classes per each entity, which potentially differs between layers, mapping layer between raw database entity and domain model, behavior-centric classes with its behavior defined).
Although the standard approach is much simpler and does not require additional mapping layers and reduces the development effort, I've decided to model the business logic with DDD approach. This way I'm implicitly fulfilling the potential business requirements (e.g making sure that post is an entity in blog aggregate only - there shouldn't be a post without any blog linked). Although DDD imposes more development effort and defines rules to follow, it helps to model the business logic more precisely. I do realize that application is small enough, that these changes probably won't matter, but as all applications start with some basic logic and then they grow to huge sizes, sometimes it's worth to spend more time on it.

Post as subentity vs Post as standalone entity:

I spend great time about thinking where post should be defined, what's the responsbility of such class, what does it represent and how to interact with it. Creating post in isolation was much easier and faster, as it wouldn't require any specific relations between entity (other than the database ones), however it wouldn't model the business as good as it could. Making post as a standalone entity, without any implicit rules defined of how to interact with it could cause a lot of inconsistencies in the future - while working on the application. Thus I focused on the business side, which made me creating post as a subentity (entity) in blog entity (aggregate), as both of these entities have strong relationship (not only in the database models). It also imposes the REST API naming convention (/blogs/:id/posts instead of /posts). I do believe that adding some more complex logic to represent the entities is acceptable, as in the long run it helps to avoid inconsistencies.

### Given more time, what improvements or optimizations would you want to add? When would you add them?

I would definitely add below improvemnts or optimizations:

Adding observability tools (logs, metrics, traces etc.), using APM tools. It would allow us to look into the details of some requests, analysing the latency of API calls, working with charts which would tell us
different statistics about our application (e.g number of successfull calls, distribution of issues, some common failure patterns etc.). I would start with adding the logs at the development stage, slowly introducing more specific tools while releasing the application to production, as observability tools are pretty expensive, and majority of its usage is at production environment.

I would improve error handling by creating custom exceptions, providing some exception filters, mapping the exceptions to appropriate HTTP responses, working with different HTTP status codes. This step could be done right now, when application is being developed.

Adding some security features like authentication, authorization, RBAC, and throttling mechanisms, providing HTTPS connection (via SSL / TLS certificates). Such security features would improve the reliability of our application and would reduce the likelihood of some incident happening. This step is critical before application would go public, so it would be probably a time to introduce it.

I would improve the API endpoints by providing the pagination of data, serializing API responses, versioning of API etc. This step could be done right now, during the development stage.

I would definitely focus on writing different kind of tests (unit, integration, e2e, user acceptance tests or regression tests). I'm a big fan of TDD, thus I would definitely write such tests at the stage of development.

I would refactor the code to use more maintainable and flexible design patterns (e.g different strategies for retriving the data - either retriving the full blog data with posts or without them), as application would grow such strategies could be used in different places, and could be defined in different flows (e.g authenticated users have access to all data, whereas non authenticated ones have access only to blog's data without posts).

### What would you need to do to make this application scale to hundreds of thousands of users?

To make application more scalable I would:

Introduce more scalable patterns like CQRS (instead of CRUD). It would allow me to scale write and read actions in isolation (e.g using master database to handle write requests and read replicas to handle read requests, table indexes etc.).

Introduce some in-memory caching for frequently accessed resources. We would avoid calling database every time the request is being triggered.

As the application does not need to maintain any state, it would be easy to scale it horizontally. We could create some configuration for microservice to scale automatically, based on the network traffic, CPU usage, memory usage etc. Such microservice instaces would be behind the load balancer, which would also allow for distributing the traffic in some optimized way.

Instances could also be scaled vertically, by providing better resources (e.g CPU, memory, disk storage etc.), however vertical scaling has its own limitations, which is not the case for horizontal one.

If the data would grow significantly we could use database sharding, providing different instances for different regions etc. It would allow for spreading the load accross different geographical areas. We could also regulary archive the obsolate data to improve query performance and reduce storage usage and costs.

We could introduce some asynchronous logic to handle certain requests (e.g while creating a blog we can wait until entity will be created in database and return result to the user, and we can queue the background tasks for sending the e-mail to all followers of the blog owner etc.)

### How would you change the architecture to allow for models that are stored in different databases? E.g. posts are stored in Cassandra and blogs are stored in Postgres.

We could create two services which encapculates the logic for each entity on its own. Every service would have a connection to it's own database and the communication between them could be done either synchronously (via some API) or asynchronously via pub-sub mechanism. (Blog service could emit events to the post service to take appropriate actions). On top of two services, we could use some aggregation API Gateway, which would aggregate the results from both services (e.g fetching all blogs with their respective posts). We could ensure the data consistency using Saga pattern for distributed transactions.

However for small applications, we could definitely stay with one microservice, which would connect to two databases.

### How would you deploy the Architecture you designed in a production ready way?

I would start with dockerazing my application, and running the CI/CD automated pipelines (e.g using GHA) to perform tests and deploy my application to production. I would use AWS as services provider (where the services configuration would be defined using some IaC tool e.g Terraform). Docker image would be uploaded to Amazon ECR and used in Amazon ECS instances with the latest tag defined. Amazon ECS could listen on certain events (e.g pushing the docker image to Amazon ECR) and run the deployment. Amazon ECS allows for version rollbacking, canary deployment and it maintaines the history of versions.
