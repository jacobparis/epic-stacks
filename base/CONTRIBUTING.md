# Contributing to Epic Stacks

We love your input! We want to make contributing to Epic Stacks as easy and
transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github

We use GitHub to host code, to track issues and feature requests, as well as
accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)

Pull requests are the best way to propose changes to the codebase. We actively
welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be
under the same [MIT License](http://choosealicense.com/licenses/mit/) that
covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker]

We use GitHub issues to track public bugs. Report a bug by
[opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you
  tried that didn't work)

## Use a Consistent Coding Style

- Use 2 spaces for indentation rather than tabs
- You can try running `npm run lint` for style unification

## License

By contributing, you agree that your contributions will be licensed under its
MIT License.

## Project setup

If you do need to set the project up locally yourself, feel free to follow these
instructions:

### System Requirements

- [Node.js](https://nodejs.org/) >= 20.0.0
- [npm](https://npmjs.com/) >= 8.18.0
- [git](https://git-scm.com/) >= 2.38.0

### Setup steps

1.  Fork and clone the repo
2.  Copy `.env.example` into `.env`
3.  Run `npm install && npm run setup -s` to install dependencies and run
    validation
4.  Create a branch for your PR with `git checkout -b pr/your-branch-name`

> Tip: Keep your `main` branch pointing at the original repository and make pull
> requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/epicweb-dev/epic-stack.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `main` branch
> to use the upstream main branch whenever you run `git pull`. Then you can make
> all of your pull request branches based on this `main` branch. Whenever you
> want to update your version of `main`, do a regular `git pull`.

If the setup script doesn't work, you can try to run the commands manually:

```sh
git clone <your-fork>
cd ./epic-stack

# copy the .env.example to .env
#   everything's mocked out during development so you shouldn't need to
#   change any of these values unless you want to hit real environments.
cp .env.example .env

# Install deps
npm install

# setup database
prisma migrate reset --force

# Install playwright browsers
npm run test:e2e:install

# run build, typecheck, linting
npm run validate
```

If that all worked without trouble, you should be able to start development
with:

```sh
npm run dev
```

And open up `http://localhost:3000` and rock!

## Help Needed

There's something to be said for custom code and the ability that grants with
regard to tuning it to be exactly what you need. But there's also something to
be said for offloading maintenance onto external dependencies. There are likely
several bits of code in this codebase that could benefit from externalization.
There could even be some things that could be improved by existing libraries.

Feel free to take any code from within this project and turn it into an open
source library (appropriate attribution is appreciated). Then come back and make
a PR to use your new library.

NOTE: Actual adoption of your library is not guaranteed. Offloading maintenance
and adaptability is a delicate balance.
