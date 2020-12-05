#!/bin/bash
while getopts "o:r:t:" o; do
  case "${o}" in
  o)
    owner="${OPTARG}"
    ;;
  r)
    repo="${OPTARG}"
    ;;
  t)
    token="${OPTARG}"
    ;;

  *)
    echo Invalid options
    exit 1
    ;;
  esac
done
shift $((OPTIND - 1))

version=$1
# TODO: Check parameters

# Token
tokenOpt=
if [ -n "$token" ]; then
  tokenOpt="-u username:$token"
fi

# Release url
url="https://api.github.com/repos/$owner/$repo/releases/latest"
if [ -n "$version" ]; then
  url=$(
    curl -ks $tokenOpt -X GET "https://api.github.com/repos/$owner/$repo/releases" |
      jq -rc ".[] | select( .tag_name == \"v${version}\" ) | .url"
  )
fi

# Release
echo $(curl -ks $tokenOpt -X GET ${url})
