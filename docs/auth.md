This is for auth from the provisioner to cloud providers.
NOT the auth between user/machine/agent and the platform api.

## GCP

### outside the cloud -> cloud apis

#### old way

- customer creates a GCP SA w/ owner in a project they own
- create a SA key, gives that to us.

pros

- the gcp json creds have valuable metadata like the project id

cons

- cross-project perms are managed by the customer
- cross-project use-cases are common, esp at enterprise (networking, containers, storage)

#### new way

- customer creates a GCP SA w/ roles xyz...
- set up WIF
  - I've done this from OICD providers like GH but not from a private API. I think Eric is more familiar with that piece.
  - offer a script or bake it into the "ada" cli to configure the customer project.

pros

- no static keys

cons

- same cross-project perm issue

#### other options

- we could manage _entire_ projects for them. give us project create on a folder in their org for dev, then another sa w/ folder create for prod. cc could even manage the hierarchy, if desired.

### cloud workload -> cloud apis

we're all very familiar with this. will backfill later.

## Azure

I wrote a blog about this I can dig up but... it's really close to GCP.

outside cloud -> cloud

- very much a service account + sa key like experience with their Terraform provider.

cloud workload -> cloud api

- roles can be assigned to identities and identities can be assigned to things like their cloud run.
