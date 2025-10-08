#!/bin/bash
cd /home/kavia/workspace/code-generation/palestine-youth-employment-platform-147458-147467/job_matching_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

