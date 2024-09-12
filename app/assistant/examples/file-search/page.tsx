"use client";
import React from "react";
import styles from "../shared/page.module.css";

import Chat from "@/components/assistant/chat";
import FileViewer from "@/components/assistant/file-viewer";

const FileSearchPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          {/* <FileViewer /> */}
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FileSearchPage;
