#!/usr/bin/env bash

set -e

scriptDirectory=""

operatingSystemFamily=`uname`

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

cd ${scriptDirectory}
script="${scriptDirectory}/vdjsight.sh"

function script_help() {
    echo " Commands                                                    "
    echo "                                                             "
    echo "  frontend             -   Frontend related commands         "
    echo "     install           -     :Install dependencies using yarn"
    echo "     clean             -     :Clean installed dependencies   "
    echo "     serve             -     :Serve dev version              "
    echo "     build             -     :Build prod version             "
    echo "     test              -     :Test frontend                  "
    echo "     test-ci           -     :Test frontend with CI          "
    echo "                                                             "
    echo "  backend              -   Backend related commands          "
    echo "     serve             -     :Serve dev version              "
    echo "     build             -     :Build prod version             "
    echo "     test              -     :Test backend                   "
    echo "                                                             "
    echo "  dev-environment                                            "
    echo "     start             -     :Start develop environment      "
    echo "     stop              -     :Stop  develop environment      "
    echo "     down              -     :Down  develop environment      "
    echo "                                                             "
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

    cd ${scriptDirectory}/frontend

    frontend_action=$1
    shift
    case ${frontend_action} in
        install)
            yarn install
            ;;
        clean)
            echo -n "Cleaning 'node_modules' from frontend directory..."
            rm -rf node_modules
            echo "Done."
            ;;
        serve)
            yarn start
            ;;
        build)
            yarn build
            ;;
        test)
            yarn test
            ;;
        test-ci)
            yarn run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
            yarn run e2e -- --protractor-config=e2e/protractor-ci.conf.js
            ;;
        *)
            script_help;
            ;;
    esac

    cd ${scriptDirectory}
}

# General section

function backend() {
    ensure_non_empty_input $#

    cd ${scriptDirectory}/backend

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
        *)
            script_help;
            ;;
    esac

    cd ${scriptDirectory}
}

# Dev environment section

function dev_environment() {
    ensure_non_empty_input $#

    cd ${scriptDirectory}/environment/dev

    dev_environment_action=$1
    shift

    case ${dev_environment_action} in
        start)
            docker-compose up -d;
            ;;
        stop)
            docker-compose stop;
            ;;
        down)
            docker-compose down;
            ;;
        *)
            script_help;
            ;;
    esac

    cd ${scriptDirectory}
}

action=$1
shift

case ${action} in
    frontend)
        frontend $@
        ;;
    backend)
        backend $@
        ;;
    dev-environment)
        dev_environment $@
        ;;
    *)
        script_help;
        ;;
esac

cd ${scriptDirectory}


