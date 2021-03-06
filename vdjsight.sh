#!/usr/bin/env bash

set -e

scriptDirectory=""

operatingSystemFamily=$(uname)

case ${operatingSystemFamily} in
    Darwin)
        scriptDirectory=$(cd "$(dirname "$0")"; pwd)
    ;;
    Linux)
        scriptDirectory="$(dirname "$(readlink -f "$0")")"
    ;;
    *)
       echo "Unsupported OS."
       exit 1
    ;;
esac

cd "${scriptDirectory}"
script="${scriptDirectory}/vdjsight.sh"

function script_help() {
    echo " Commands                                                                                                                     "
    echo "                                                                                                                              "
    echo "  frontend                     -   Frontend related commands                                                                  "
    echo "     install                   -     :Install dependencies using yarn                                                         "
    echo "     clean        [--full]     -     :Clean frontend bundle (use --full to delete installed dependencies)                     "
    echo "     serve                     -     :Serve dev version                                                                       "
    echo "     build                     -     :Build prod version                                                                      "
    echo "     test         [--ci  ]     -     :Test frontend (use --ci to indicate CI environment)                                     "
    echo "     docker <tag> [--fast]     -     :Create Docker image with tag specified (use --fast flag if frontend was build locally)  "
    echo "                                                                                                                              "
    echo "  backend                      -   Backend related commands                                                                   "
    echo "     serve                     -     :Serve dev version                                                                       "
    echo "     build                     -     :Build prod version                                                                      "
    echo "     test                      -     :Test backend                                                                            "
    echo "     docker   <tag>            -     :Create Docker image with tag specified                                                  "
    echo "                                                                                                                              "
    echo "  dev-environment                                                                                                             "
    echo "     up                        -     :Up        develop environment                                                           "
    echo "     stop                      -     :Stop      develop environment                                                           "
    echo "     down                      -     :Down      develop environment                                                           "
    echo "     recreate                  -     :Recreate  develop environment                                                           "
    echo "     create-ssl                -     :Create    ssl self signed certificates                                                  "
    echo "     remove-ssl                -     :Remove    ssl self signed certificates                                                  "
    echo "                                                                                                                              "
    echo "  dependencies                                                                                                                "
    echo "     install                   -     :Install   external dependencies                                                         "
    echo "        mir <dir>              -        :MIR                                                                                  "
}

function ensure_non_empty_input() {
    if [[ $1 == 0 ]]; then
        script_help;
        exit 0;
    fi
}

ensure_non_empty_input $#

# Frontend Section

function frontend() {
    ensure_non_empty_input $#

    cd "${scriptDirectory}/frontend"

    frontend_action=$1
    shift
    case ${frontend_action} in
        install)
            yarn install --check-files --pure-lockfile || exit 1
            ;;
        clean)
            yarn build:clean;
            if [[ "$1" == "--full" ]]; then
                echo -n "Cleaning 'node_modules' from frontend directory..."
                rm -rf node_modules
                echo "Done."
            fi
            ;;
        serve)
            yarn start
            ;;
        build)
            yarn build
            ;;
        test)
            if [[ "$1" == "--ci" ]]; then
                yarn run test:ci
            else
                yarn run test
            fi
            ;;
        docker)
            [[ -z "$1" ]] && echo "Tag parameters is required" && exit;
            [[ "$2" == "--fast" ]] && df="Dockerfile.fast" || df="Dockerfile"
            docker build -f ${df} -t "bvdmitri/vdjsight-frontend:$1" .
            ;;
        *)
            script_help;
            ;;
    esac

    cd "${scriptDirectory}"
}

# General section

function backend() {
    ensure_non_empty_input $#

    cd "${scriptDirectory}/backend"

    backend_action=$1
    shift
    case ${backend_action} in
        serve)
            sbt run;
            ;;
        build)
            sbt dist;
            ;;
        test)
            sbt test;
            ;;
        docker)
            [[ -z "$1" ]] && echo "Tag parameters is required" && exit;
            sbt "set version in Docker := \"$1\"" docker:publishLocal
            ;;
        *)
            script_help;
            ;;
    esac

    cd "${scriptDirectory}"
}

# Dev environment section

function dev_environment() {
    ensure_non_empty_input $#

    cd "${scriptDirectory}/environment/dev"

    dev_environment_action=$1
    shift

    case ${dev_environment_action} in
        up)
            docker-compose up -d;
            ;;
        stop)
            docker-compose stop;
            ;;
        down)
            docker-compose down;
            ;;
        recreate)
            docker-compose down;
            docker-compose up -d;
            ;;
        create-ssl)
            openssl req -new -x509 -newkey rsa:2048 -sha256 -nodes -keyout ./ssl/frontend.key -days 3650 -out ./ssl/frontend.crt -config ./ssl/certificate-frontend.cnf
            openssl req -new -x509 -newkey rsa:2048 -sha256 -nodes -keyout ./ssl/backend.key -days 3650 -out ./ssl/backend.crt -config ./ssl/certificate-backend.cnf
            openssl pkcs12 -export -in ./ssl/backend.crt -inkey ./ssl/backend.key -name vdjsight-backend -out ./ssl/backend-keystore.p12 -passout pass:vdjsight
            keytool -importkeystore -srcstorepass vdjsight -deststorepass vdjsight -destkeystore ./ssl/backend-keystore.jks -srckeystore ./ssl/backend-keystore.p12 -srcstoretype PKCS12
            ;;
        remove-ssl)
            ;;
        *)
            script_help;
            ;;
    esac

    cd "${scriptDirectory}"
}

# Dependencies section

function dependencies() {
  ensure_non_empty_input $#

  dependencies_action=$1
  shift

  case ${dependencies_action} in
    install)
      dependecies_install "$@"
      ;;
    *)
      script_help;
      ;;
  esac

  cd "${scriptDirectory}"
}

function dependecies_install() {
  ensure_non_empty_input $#

  dependencies_install_action=$1
  shift

  case ${dependencies_install_action} in
    mir)
      clone_directory="/tmp/mir"
      [ -n "$1" ] && clone_directory="$1"
      git clone --depth 3 git@github.com:antigenomics/mir.git "${clone_directory}"
      cd "$clone_directory"
      mvn clean install -Dmaven.test.skip=true
      ;;
    *)
      script_help;
      ;;
  esac

}

action=$1
shift

case ${action} in
    frontend)
        frontend "$@"
        ;;
    backend)
        backend "$@"
        ;;
    dev-environment)
        dev_environment "$@"
        ;;
    dependencies)
        dependencies "$@"
        ;;
    *)
        script_help;
        ;;
esac

cd "${scriptDirectory}"


