console.log("Norvalis AI loaded");

const messages = document.querySelector(".chat-content");
const chatMessages = document.getElementById("chatMessages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const searchInput =document.querySelector(".search-container input");

const emptyState = document.getElementById("emptyState");
const chatHeader = document.getElementById("chatHeader");


const renameHeaderBtn = document.getElementById("renameHeaderBtn");

const exportMenuBtn =
    document.getElementById("exportMenuBtn");

const exportMenu =
    document.getElementById("exportMenu");

const exportTxtBtn =
    document.getElementById("exportTxtBtn");

const exportMdBtn =
    document.getElementById("exportMdBtn");

const exportHtmlBtn =
    document.getElementById("exportHtmlBtn");

const deleteChatBtn = document.getElementById("deleteChatBtn");



const settingsBtn =
    document.getElementById("settingsBtn");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettingsBtn =
    document.getElementById("closeSettingsBtn");

const themeToggleBtn =
    document.getElementById("themeToggleBtn");

const fontIncreaseBtn =
    document.getElementById("fontIncreaseBtn");

const fontDecreaseBtn =
    document.getElementById("fontDecreaseBtn");

const fontSizeValue =
    document.getElementById("fontSizeValue");

const exportChatsBtn =
    document.getElementById("exportChatsBtn");

const importChatsBtn =
    document.getElementById("importChatsBtn");

const importChatsInput =
    document.getElementById("importChatsInput");


const deleteModal =
    document.getElementById("deleteModal");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");



// Markdown rendering and syntax highlighting for AI responses 
//messageDiv.innerHTML = marked.parse(aiResponse);
//messageDiv.querySelectorAll('pre code').forEach(block => {
//    hljs.highlightElement(block);
//});


let isNewChat = true;

let chats = [];
let currentChatId = null;

let searchTerm = "";

let currentTheme = "dark";

let isLoadingChat = false;

marked.setOptions({
    breaks: true
});


chatHeader.style.display = "none";

exportMenu.style.display = "none";

// Convert common LaTeX math notation to readable Unicode symbols
function normalizeMathNotation(text) {

    if (!text) return text;


    const greekLetters = {

        "\\alpha": "α",
        "\\beta": "β",
        "\\gamma": "γ",
        "\\delta": "δ",
        "\\epsilon": "ε",
        "\\varepsilon": "ε",
        "\\zeta": "ζ",
        "\\eta": "η",
        "\\theta": "θ",
        "\\vartheta": "ϑ",
        "\\iota": "ι",
        "\\kappa": "κ",
        "\\lambda": "λ",
        "\\mu": "μ",
        "\\nu": "ν",
        "\\xi": "ξ",
        "\\pi": "π",
        "\\varpi": "ϖ",
        "\\rho": "ρ",
        "\\sigma": "σ",
        "\\tau": "τ",
        "\\upsilon": "υ",
        "\\phi": "φ",
        "\\varphi": "φ",
        "\\chi": "χ",
        "\\psi": "ψ",
        "\\omega": "ω",

        "\\Gamma": "Γ",
        "\\Delta": "Δ",
        "\\Theta": "Θ",
        "\\Lambda": "Λ",
        "\\Xi": "Ξ",
        "\\Pi": "Π",
        "\\Sigma": "Σ",
        "\\Phi": "Φ",
        "\\Psi": "Ψ",
        "\\Omega": "Ω"
    };


    const symbols = {

        "\\times": "×",
        "\\cdot": "·",
        "\\div": "÷",
        "\\pm": "±",
        "\\mp": "∓",

        "\\leq": "≤",
        "\\le": "≤",
        "\\geq": "≥",
        "\\ge": "≥",
        "\\neq": "≠",
        "\\ne": "≠",
        "\\approx": "≈",
        "\\sim": "∼",

        "\\rightarrow": "→",
        "\\to": "→",
        "\\leftarrow": "←",
        "\\Rightarrow": "⇒",
        "\\Leftarrow": "⇐",

        "\\infty": "∞",
        "\\partial": "∂",
        "\\nabla": "∇",
        "\\sum": "∑",
        "\\prod": "∏",

        "\\degree": "°",
        "\\circ": "°"
    };


    /*
     * Protect fenced code blocks.
     * Mathematical notation inside code must NOT be changed.
     */
    const codeBlocks = [];

    text = text.replace(
        /```[\s\S]*?```/g,
        match => {

            const index =
                codeBlocks.length;

            codeBlocks.push(match);

            return `§§NORVALISCODE${index}§§`;
        }
    );


    /*
     * Convert Greek letters and common symbols.
     */
    Object.entries(greekLetters)
        .forEach(([latex, symbol]) => {

            text =
                text.replaceAll(
                    latex,
                    symbol
                );
        });


    Object.entries(symbols)
        .forEach(([latex, symbol]) => {

            text =
                text.replaceAll(
                    latex,
                    symbol
                );
        });


    /*
     * Convert \frac{a}{b} → a/b
     */
    text = text.replace(
        /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,
        "$1/$2"
    );


    /*
     * Convert square roots.
     */
    text = text.replace(
        /\\sqrt\s*\{([^{}]+)\}/g,
        "√($1)"
    );


    /*
     * Convert simple superscripts.
     */
    const superscripts = {

        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹",
        "+": "⁺",
        "-": "⁻",
        "=": "⁼",
        "(": "⁽",
        ")": "⁾",
        "n": "ⁿ",
        "i": "ⁱ"
    };


    text = text.replace(
        /\^(\{([^{}]+)\}|[0-9n])/g,
        (match, value, grouped) => {

            const content =
                grouped || value;

            return [...content]
                .map(char =>
                    superscripts[char] || char
                )
                .join("");
        }
    );


    /*
     * Convert simple subscripts.
     */
    const subscripts = {

        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉",
        "+": "₊",
        "-": "₋",
        "=": "₌",
        "(": "₍",
        ")": "₎",
        "a": "ₐ",
        "e": "ₑ",
        "i": "ᵢ",
        "j": "ⱼ",
        "k": "ₖ",
        "l": "ₗ",
        "m": "ₘ",
        "n": "ₙ",
        "o": "ₒ",
        "p": "ₚ",
        "r": "ᵣ",
        "s": "ₛ",
        "t": "ₜ",
        "u": "ᵤ",
        "v": "ᵥ",
        "x": "ₓ",
        "y": "ᵧ"
    };


    text = text.replace(
        /_(\{([^{}]+)\}|[a-zA-Z0-9])/g,
        (match, value, grouped) => {

            const content =
                grouped || value;

            return [...content]
                .map(char =>
                    subscripts[char] || char
                )
                .join("");
        }
    );


    /*
     * Remove remaining math delimiters.
     */
    text = text.replace(
        /\$\$([\s\S]*?)\$\$/g,
        "$1"
    );

    text = text.replace(
        /\$([^$\n]+)\$/g,
        "$1"
    );


    /*
     * Restore fenced code blocks unchanged.
     */
    codeBlocks.forEach(
        (block, index) => {

            text =
                text.replace(
                    `§§NORVALISCODE${index}§§`,
                    block
                );
        }
    );


    return text;
}

// Get clean readable text from a rendered AI message
function getPlainTextFromMessage(container) {

    const clone =
        container.cloneNode(true);

    /*
     * Remove interactive elements
     * that should never be copied.
     */
    clone
        .querySelectorAll(
            ".message-actions, .code-header, .copy-btn"
        )
        .forEach(element => {
            element.remove();
        });

    return clone.innerText
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

// Enhance code blocks with syntax highlighting and controls
function enhanceCodeBlocks(container) {

    container
        .querySelectorAll("pre code")
        .forEach(block => {

            if (
                typeof hljs !== "undefined"
            ) {

                hljs.highlightElement(
                    block
                );
            }
        });


    container
        .querySelectorAll("pre")
        .forEach(pre => {

            /*
             * Prevent duplicate headers
             * when a message is rendered again.
             */
            if (
                pre.querySelector(".code-header")
            ) {
                return;
            }


            const code =
                pre.querySelector("code");

            if (!code) {
                return;
            }


            const header =
                document.createElement("div");

            header.className =
                "code-header";


            const button =
                document.createElement("button");

            button.className =
                "copy-btn";

            button.textContent =
                "Copy";


            button.onclick = () => {

                navigator.clipboard.writeText(
                    code.innerText
                );

                button.textContent =
                    "Copied!";

                setTimeout(() => {

                    button.textContent =
                        "Copy";

                }, 2000);
            };


            const langClass =
                [...code.classList]
                    .find(className =>
                        className.startsWith(
                            "language-"
                        )
                    );


            const languageName =
                langClass
                    ? langClass.replace(
                        "language-",
                        ""
                    )
                    : "code";


            const language =
                document.createElement(
                    "span"
                );

            language.textContent =
                languageName.toUpperCase();


            header.appendChild(
                language
            );

            header.appendChild(
                button
            );


            pre.prepend(
                header
            );
        });
}

// Save Chats to Local Storage ************************
function saveChats() {

    const chatData =
        JSON.stringify(chats);

    localStorage.setItem(
        "norvalis_chats",
        chatData
    );

    localStorage.setItem(
        "norvalis_current_chat",
        currentChatId
    );

    localStorage.setItem(
        "norvalis_chats_backup",
        chatData
    );

}

// Export All Chats ************************
function exportAllChats() {

    const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        chats: chats
    };

    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type: "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);

    a.download =
        `norvalis-chat-backup-${date}-${Date.now()}.json`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("All chats exported");
}

// Import All Chats ************************
function importAllChats(file) {

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = (event) => {

        try {

            const backup =
                JSON.parse(
                    event.target.result
                );

            if (
                !backup ||
                !Array.isArray(backup.chats)
            ) {

                throw new Error(
                    "Invalid Norvalis backup file."
                );
            }

            const confirmed =
                confirm(
                    "Importing this backup will replace your current chat history. Continue?"
                );

            if (!confirmed) {
                return;
            }

            chats =
                backup.chats;

            chats.forEach(chat => {

                if (
                    chat.isPinned === undefined
                ) {
                    chat.isPinned = false;
                }

            });

            currentChatId =
                chats.length > 0
                    ? chats[0].id
                    : null;

            saveChats();

            renderChatList();

            if (currentChatId) {

                loadChat(
                    currentChatId
                );

            } else {

                startNewChat();

            }

            showToast(
                "Chat history imported"
            );

        }
        catch (error) {

            console.error(
                "Import failed:",
                error
            );

            alert(
                "This is not a valid Norvalis chat backup."
            );

        }

    };

    reader.readAsText(file);
}

// Get Current Chat by ID ************************
function getCurrentChat() {

    if (!currentChatId) return null;

    return chats.find(
        chat => chat.id === currentChatId
    );

}


// Create a New Chat ************************
function createChat() {

    const chat = {

        id: Date.now(),

        title: "New Chat",

        messages: [],
        isPinned: false
    };

    chats.unshift(chat);

    currentChatId = chat.id;

    saveChats();

    renderChatList();

    return chat;
}


// Render Chat Item in Sidebar ************************
function renderChatItem(chat, container) {
    
    const item = document.createElement("div");

    item.className = "chat-item";

    if (
        chat.id === currentChatId
    ) {
        item.classList.add("active");
    }

    item.innerHTML = `
        <span class="chat-title">${chat.title}</span>
        <button class="chat-menu-btn">&hellip;</button>
    `;

    
    const menu = document.createElement("div");

    menu.className = "chat-menu";

    menu.innerHTML = `
        <button class="pin-chat-btn">
            <span class="menu-icon">📌</span>
            ${chat.isPinned ? "Unpin Chat" : "Pin Chat"}
        </button>

        <button class="rename-chat-btn">
            <span class="menu-icon">✏️</span>
            Rename
        </button>

        <button class="delete-chat-btn">
             <span class="menu-icon">🗑</span>
             Delete
        </button>
    `;

    document.body.appendChild(menu);
    menu.style.display = "none";

    const pinBtn =
        menu.querySelector(".pin-chat-btn");

    const renameBtn =
        menu.querySelector(".rename-chat-btn");

    const deleteBtn =
        menu.querySelector(".delete-chat-btn");
        



    document.body.appendChild(menu);
    menu.style.display = "none";

    menu.addEventListener(
        "click",
        (e) => e.stopPropagation()
    );

    const menuBtn = item.querySelector(".chat-menu-btn");

    menuBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        document
            .querySelectorAll(".chat-menu")
            .forEach(m => {

                if (m !== menu) {
                    m.style.display = "none";
                }
            });

        if (menu.style.display === "block") {

            menu.style.display = "none";

            return;
        }

        const rect =
            menuBtn.getBoundingClientRect();

        menu.style.left =
            `${rect.right + 8}px`;

        menu.style.top =
            `${rect.top + 8}px`;

        menu.style.display =
            "block";
    });

    
    renameBtn.addEventListener("click", () => {

        document
            .querySelectorAll(".chat-menu")
            .forEach(m => {
                m.style.display = "none";
            });

        loadChat(chat.id);

        renameCurrentChat();
    });


    pinBtn.addEventListener("click", () => {

        menu.style.display = "none";

        chat.isPinned = !chat.isPinned;

        saveChats();

        menu.style.display = "none";

        renderChatList();
    });



    deleteBtn.addEventListener("click", () => {

        menu.style.display = "none";
      

        showDeleteModal(() => {

            chats = chats.filter(
                c => c.id !== chat.id
            );
        

        if (currentChatId === chat.id) {

            currentChatId = null;

            chatMessages.innerHTML = "";

            emptyState.style.display = "flex";
            chatHeader.style.display = "none";
            isNewChat = true;
        }

        saveChats();

        renderChatList();
    });
    });

    item.addEventListener(
        "click",
        () => loadChat(chat.id)
    );

    container.appendChild(item);

}

// Render Chat List in Sidebar ************************
function renderChatList() {

    const container =
        document.getElementById("chatHistory");
    
    container.innerHTML = "";

    const filteredChats =
    chats.filter(chat =>

        chat.title
            .toLowerCase()
            .includes(searchTerm)

        ||

        chat.messages.some(message =>

            (message.raw || message.content || "")
                .toLowerCase()
                .includes(searchTerm)

        )

    );

    const pinnedChats =
        filteredChats.filter(
            chat => chat.isPinned
        );

    const regularChats =
        filteredChats.filter(
            chat => !chat.isPinned
        );

    if (filteredChats.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "sidebar-empty-search";

        empty.textContent =
            "No chats found";

        container.appendChild(empty);

        return;
    }
    
    

    // PINNED heading
    const pinnedHeader = document.createElement("div");
    pinnedHeader.className = "sidebar-section-header";
    pinnedHeader.textContent = "PINNED";

    container.appendChild(pinnedHeader);
    
    // render pinned chats
    pinnedChats.forEach(chat => {
        renderChatItem(chat, container);
    });
    
    // CHATS heading
    
    const recentsHeader = document.createElement("div");
    recentsHeader.className = "sidebar-section-header";
    recentsHeader.textContent = "RECENTS";

    container.appendChild(recentsHeader);
    // render regular chats
    regularChats.forEach(chat => {
        renderChatItem(chat, container);
    });


}


// Load Chats from Local Storage ************************
function loadChats() {



    const saved =
    localStorage.getItem(
        "norvalis_chats"
    );

    const backup =
        localStorage.getItem(
            "norvalis_chats_backup"
        );

    if (!saved) {

        if (backup) {

            console.warn(
                "Norvalis: Primary chat storage missing. Restoring from backup."
            );

            localStorage.setItem(
                "norvalis_chats",
                backup
            );

            chats =
                JSON.parse(backup);

        } else {

            createChat();

            return;
        }

    }
    else {

        chats =
            JSON.parse(saved);

    }

    chats = JSON.parse(saved);

    
    chats.forEach(chat => {

        if (chat.isPinned === undefined) {
            chat.isPinned = false;
        }

    });

    const savedCurrentChat =
        localStorage.getItem(
            "norvalis_current_chat"
        );


    if (!savedCurrentChat) {

        renderChatList();

        startNewChat();

        return;
    }

    if (
        savedCurrentChat &&
        chats.some(
            c => c.id == savedCurrentChat
        )
    ) {
        currentChatId = Number(savedCurrentChat);
    }
    else {
        currentChatId = chats[0].id;
    }



    if (chats.length === 0) {

        createChat();

        return;
    }

    renderChatList();

    loadChat(
        currentChatId
    );
}



// Load a Specific Chat by ID ************************
function loadChat(chatId) {

    isLoadingChat = true;
    currentChatId = chatId;

    const chat =
        chats.find(
            c => c.id === chatId
        );

    chatMessages.innerHTML = "";

    if (!chat) return;

        chat.messages.forEach((message,index) => {

            if (message.role === "user") {

            createMessage(
                message.content,
                "user",
                index   
            );

        } else {

            createMessage(
                message.html,
                "ai",
                index,
                message.raw
            );

        }

    });

    chatHeader.style.display =
        "flex";

    document.getElementById("chatTitle").textContent = chat.title;

    emptyState.style.display =
        "none";

    isNewChat = false;

    renderChatList();

    saveChats();
    isLoadingChat = false;
}


// Delete Current Chat ************************
function deleteCurrentChat() {

    showDeleteModal(() => {

        chats = chats.filter(
            chat => chat.id !== currentChatId
        );


    saveChats();

    removeTypingIndicator();

    chatMessages.innerHTML = "";

    emptyState.style.display = "flex";

    chatHeader.style.display = "none";

    document.getElementById("chatTitle").textContent = "New Chat";

    isNewChat = true;

    currentChatId = null;

    input.value = "";

    input.focus();

    renderChatList();

    });
}


// Export Current Chat ************************
function exportCurrentChat() {

    const chat =
        getCurrentChat();

    if (!chat) return;

    let content = "";

    content += `${chat.title}\n`;
    content += "=".repeat(chat.title.length);
    content += "\n\n";

    chat.messages.forEach(message => {

        const sender =
            message.role === "user"
                ? "You"
                : "Norvalis AI";

        const text =
            message.content ||
            message.raw ||
            "";

        content += `${sender}:\n`;
        content += `${text}\n\n`;

    });

    const blob =
        new Blob(
            [content],
            { type: "text/plain" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `${chat.title}.txt`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("Chat exported");
}


// Export Current Chat as Markdown ************************
function exportCurrentChatMarkdown() {

    const chat =
        getCurrentChat();

    if (!chat) return;

    let content = "";

    content += `# ${chat.title}\n\n`;

    chat.messages.forEach(message => {

        const sender =
            message.role === "user"
                ? "You"
                : "Norvalis AI";

        const text =
            message.content ||
            message.raw ||
            "";

        content += `## ${sender}\n\n`;
        content += `${text}\n\n`;
    });

    const blob =
        new Blob(
            [content],
            { type: "text/markdown" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `${chat.title}.md`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("Chat exported");
}

// Export Current Chat as PDF ************************
function exportCurrentChatPDF() {

    const chat =
        getCurrentChat();

    if (!chat) return;


    const messagesHTML =
        chat.messages.map(message => {

            const sender =
                message.role === "user"
                    ? "You"
                    : "Norvalis AI";


            let content =
                message.html ||
                marked.parse(
                    message.content ||
                    message.raw ||
                    ""
                );


            const temp =
                document.createElement("div");

            temp.innerHTML =
                content;


            /* Apply syntax highlighting */
            temp
                .querySelectorAll("pre code")
                .forEach(block => {

                    const langClass =
                        [...block.classList]
                            .find(className =>
                                className.startsWith("language-")
                            );


                    if (
                        langClass &&
                        typeof hljs !== "undefined"
                    ) {

                        const languageName =
                            langClass.replace(
                                "language-",
                                ""
                            );


                        if (
                            hljs.getLanguage(
                                languageName
                            )
                        ) {

                            const highlighted =
                                hljs.highlight(
                                    block.textContent,
                                    {
                                        language:
                                            languageName
                                    }
                                );


                            block.innerHTML =
                                highlighted.value;

                            block.classList.add(
                                "hljs"
                            );
                        }
                    }
                });


            /* Remove interactive controls */
            temp
                .querySelectorAll(".copy-btn")
                .forEach(button =>
                    button.remove()
                );


            /* Add code headers */
            temp
                .querySelectorAll("pre")
                .forEach(pre => {

                    if (
                        pre.querySelector(
                            ".code-header"
                        )
                    ) {
                        return;
                    }


                    const code =
                        pre.querySelector(
                            "code"
                        );

                    if (!code) return;


                    const langClass =
                        [...code.classList]
                            .find(className =>
                                className.startsWith(
                                    "language-"
                                )
                            );


                    const languageName =
                        langClass
                            ? langClass.replace(
                                "language-",
                                ""
                            )
                            : "code";


                    const header =
                        document.createElement(
                            "div"
                        );

                    header.className =
                        "code-header";


                    const language =
                        document.createElement(
                            "span"
                        );

                    language.textContent =
                        languageName.toUpperCase();


                    header.appendChild(
                        language
                    );


                    pre.prepend(
                        header
                    );
                });


            return `
                <section class="pdf-message ${message.role}">

                    <div class="pdf-sender">
                        ${sender}
                    </div>

                    <div class="pdf-message-content">
                        ${temp.innerHTML}
                    </div>

                </section>
            `;

        }).join("");


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        showToast(
            "Please allow pop-ups for PDF export"
        );

        return;
    }


    printWindow.document.write(`
<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>
        ${escapeHtml(chat.title)}
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        @page {

            size: A4;

            margin:
                18mm
                16mm
                18mm
                16mm;
        }


        body {

            margin: 0;

            background: white;

            color: #1f2937;

            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

            font-size: 10.5pt;

            line-height: 1.6;
        }


        .pdf-container {

            width: 100%;

            max-width: 180mm;

            margin: 0 auto;
        }


        .pdf-header {

            margin-top: 20px;
            margin-bottom: 28px;

            padding-bottom: 14px;

            border-bottom:
                1px solid #e5e7eb;
        }


        .pdf-header h1 {

            margin: 0 0 6px;

            color: #111827;

            font-size: 20pt;

            font-weight: 600;
        }


        .pdf-header p {

            margin: 0;

            color: #6b7280;

            font-size: 8.5pt;
        }


        .pdf-message {

            margin-bottom: 24px;
        }


        .pdf-message.user {

            margin-bottom: 28px;

            padding: 12px 14px;

            background: #f8f7ff;

            border:
                1px solid #e9e7ff;

            border-radius: 10px;
        }


        .pdf-sender {

            margin-bottom: 7px;

            color: #4b5563;

            font-size: 8.5pt;

            font-weight: 600;
        }


        .pdf-message-content {

            color: #1f2937;

            font-size: 10.5pt;

            line-height: 1.6;
        }


        .pdf-message-content p {

            margin:
                0 0 10px;
        }


        .pdf-message-content p:last-child {

            margin-bottom: 0;
        }


        .pdf-message-content h1,
        .pdf-message-content h2,
        .pdf-message-content h3,
        .pdf-message-content h4 {

            color: #111827;

            line-height: 1.3;

            page-break-after: avoid;
        }


        .pdf-message-content h1 {

            margin:
                20px 0 10px;

            font-size: 17pt;
        }


        .pdf-message-content h2 {

            margin:
                18px 0 9px;

            font-size: 14pt;
        }


        .pdf-message-content h3 {

            margin:
                16px 0 8px;

            font-size: 12pt;
        }

        .pdf-message-content h4 {

            margin:
                24px 0 7px;

            font-size: 0.98pt;
            font-weight: 550;
            line-height: 1.45;
        }


        .pdf-message-content ul,
        .pdf-message-content ol {

            margin:
                8px 0 12px;

            padding-left: 22px;
        }


        .pdf-message-content li {

            margin:
                4px 0;
        }


        .pdf-message-content blockquote {

            margin:
                12px 0;

            padding:
                8px 14px;

            border-left:
                3px solid #6366f1;

            color: #4b5563;

            background: #f8fafc;
        }


        .pdf-message-content table {

            width: 100%;

            margin:
                14px 0;

            border-collapse:
                collapse;

            font-size: 9pt;

            page-break-inside: avoid;
        }


        .pdf-message-content th,
        .pdf-message-content td {

            padding:
                7px 9px;

            border:
                1px solid #d1d5db;

            text-align: left;

            vertical-align: top;
        }


        .pdf-message-content th {

            background: #f3f4f6;

            color: #111827;

            font-weight: 600;
        }


        .pdf-message-content a {

            color: #4f46e5;

            text-decoration: none;
        }


        .pdf-message-content :not(pre) > code {

            padding:
                2px 5px;

            background: #f3f4f6;

            border-radius: 4px;

            color: #374151;

            font-family:
                "JetBrains Mono",
                Consolas,
                monospace;

            font-size: 8.5pt;
        }


        .pdf-message-content pre {

            margin:
                14px 0;

            overflow: hidden;

            background: #0d1424;

            border:
                1px solid #d1d5db;

            border-radius: 9px;

            page-break-inside: avoid;
        }


        .pdf-message-content pre code {

            display: block;

            padding:
                13px 15px;

            color: #c9d1d9;

            background: transparent !important;

            font-family:
                "JetBrains Mono",
                Consolas,
                Monaco,
                monospace;

            font-size: 8.2pt;

            line-height: 1.55;

            white-space: pre-wrap;

            word-break: break-word;
        }


        .code-header {

            display: flex;

            align-items: center;

            min-height: 28px;

            padding:
                5px 9px;

            background: #111827;

            border-bottom:
                1px solid #263244;

            color: #94a3b8;

            font-size: 7pt;

            font-weight: 600;

            letter-spacing: .05em;

            text-transform: uppercase;
        }


        /* Highlight.js — GitHub Dark */

        .hljs {
            color: #c9d1d9;
            background: transparent;
        }


        .hljs-keyword,
        .hljs-doctag,
        .hljs-type,
        .hljs-variable.language_ {

            color: #ff7b72;
        }


        .hljs-title,
        .hljs-title.class_,
        .hljs-title.function_ {

            color: #d2a8ff;
        }


        .hljs-string,
        .hljs-regexp {

            color: #a5d6ff;
        }


        .hljs-number,
        .hljs-literal,
        .hljs-variable {

            color: #79c0ff;
        }


        .hljs-built_in,
        .hljs-symbol {

            color: #ffa657;
        }


        .hljs-comment {

            color: #8b949e;
        }


        .hljs-name,
        .hljs-selector-tag {

            color: #7ee787;
        }


        .hljs-section {

            color: #1f6feb;

            font-weight: 700;
        }


        @media print {

            .pdf-message {

                break-inside: auto;
            }


            .pdf-message-content h1,
            .pdf-message-content h2,
            .pdf-message-content h3,
            .pdf-message-content h4 {

                break-after: avoid;
            }


            .pdf-message-content pre,
            .pdf-message-content table {

                break-inside: avoid;
            }
        }

    </style>

</head>


<body>

    <main class="pdf-container">

        <header class="pdf-header">

            <h1>
                ${escapeHtml(chat.title)}
            </h1>

            <p>
                Exported from Norvalis AI
            </p>

        </header>


        ${messagesHTML}

    </main>

</body>

</html>
    `);


    printWindow.document.close();


    printWindow.focus();


    printWindow.onload = () => {

        setTimeout(() => {

            printWindow.print();

        }, 300);
    };


    showToast("Preparing PDF...");
}

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
function sanitizeFilename(name) {

    return name
        .replace(/[<>:"/\\|?*]/g, "")
        .trim()
        .slice(0, 100) || "Norvalis Conversation";
}

// Export Current Chat as HTML ************************
function exportHTML() {

    const chat = getCurrentChat();

    if (!chat) return;

    const messagesHTML =
        chat.messages.map(message => {

            const sender =
                message.role === "user"
                    ? "You"
                    : "Norvalis AI";

            let content =
                message.html ||
                marked.parse(
                    message.content ||
                    message.raw ||
                    ""
                );

            const temp =
                document.createElement("div");

            temp.innerHTML = content;

            /* Apply syntax highlighting for export */
            temp
                .querySelectorAll("pre code")
                .forEach(block => {

                    const langClass =
                        [...block.classList]
                            .find(className =>
                                className.startsWith("language-")
                            );

                    if (!langClass) {
                        return;
                    }

                    const languageName =
                        langClass.replace(
                            "language-",
                            ""
                        );

                    if (
                        typeof hljs !== "undefined" &&
                        hljs.getLanguage(languageName)
                    ) {

                        const highlighted =
                            hljs.highlight(
                                block.textContent,
                                {
                                    language:
                                        languageName
                                }
                            );

                        block.innerHTML =
                            highlighted.value;

                        block.classList.add("hljs");
                    }
                });


            /* Remove interactive controls */
            temp
                .querySelectorAll(".copy-btn")
                .forEach(button =>
                    button.remove()
                );


            /* Remove empty code headers */
            temp
                .querySelectorAll(".code-header")
                .forEach(header => {

                    if (
                        !header.textContent.trim()
                    ) {
                        header.remove();
                    }
                });


            content =
                temp.innerHTML;

                        /* Add code headers */
            temp
                .querySelectorAll("pre")
                .forEach(pre => {

                    if (
                        pre.querySelector(".code-header")
                    ) {
                        return;
                    }

                    const code =
                        pre.querySelector("code");

                    if (!code) {
                        return;
                    }

                    const langClass =
                        [...code.classList]
                            .find(className =>
                                className.startsWith("language-")
                            );

                    const languageName =
                        langClass
                            ? langClass
                                .replace(
                                    "language-",
                                    ""
                                )
                            : "code";

                    const header =
                        document.createElement(
                            "div"
                        );

                    header.className =
                        "code-header";

                    const language =
                        document.createElement(
                            "span"
                        );

                    language.textContent =
                        languageName.toUpperCase();

                    header.appendChild(
                        language
                    );

                    pre.prepend(header);
                });


            return `
                <section class="message ${message.role}">
                    <div class="sender">
                        ${sender}
                    </div>

                    <div class="message-content">
                        ${content}
                    </div>
                </section>
            `;
        }).join("");

    const html = `
<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${escapeHtml(chat.title)}</title>

    <style>

        ${getExportStyles()}

    </style>

</head>

<body>

    <main class="conversation">

        <header class="conversation-header">

            <h1>${escapeHtml(chat.title)}</h1>

            <p>Exported from Norvalis AI</p>

        </header>

        ${messagesHTML}

    </main>

</body>

</html>
    `;

    const blob =
        new Blob(
            [html],
            { type: "text/html" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `${sanitizeFilename(chat.title)}.html`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("HTML exported");
}


function getExportStyles() {

    return `
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px 20px;

            background: #0b1020;
            color: #e5e7eb;

            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

            line-height: 1.6;
        }

        .conversation {
            width: min(900px, 100%);
            margin: 0 auto;
        }

        .conversation-header {
            margin-bottom: 40px;
            padding-bottom: 20px;

            border-bottom:
                1px solid rgba(255,255,255,.10);
        }

        .conversation-header h1 {
            margin: 0 0 8px;

            font-size: 1.6rem;
            font-weight: 600;

            color: #f8fafc;
        }

        .conversation-header p {
            margin: 0;

            font-size: .8rem;

            color: #94a3b8;
        }

        .message {
            margin-bottom: 32px;
        }

        .sender {
            margin-bottom: 8px;

            font-size: .78rem;
            font-weight: 600;

            color: #94a3b8;
        }

        .message-content {
            font-size: .95rem;
            line-height: 1.6;
        }

        .message-content p {
            margin: 8px 0;
        }

        .message-content h1,
        .message-content h2,
        .message-content h3,
        .message-content h4 {
            color: #f8fafc;
        }

        .message-content ul,
        .message-content ol {
            padding-left: 22px;
        }

        .message-content li {
            margin: 4px 0;
        }

        .message-content a {
            color: #a5b4fc;
        }

        .message-content code {
            font-family:
                "JetBrains Mono",
                Consolas,
                Monaco,
                monospace;

            font-size: .84rem;
        }

        .message-content :not(pre) > code {
            background: rgba(255,255,255,.08);

            padding: 2px 6px;

            border-radius: 5px;
        }

        .message-content pre {
            margin: 16px 0;

            overflow-x: auto;

            background: #0d1424;

            border:
                1px solid rgba(255,255,255,.08);

            border-radius: 12px;
        }

        .message-content pre code {
            display: block;

            padding: 16px 18px;

            background: transparent !important;

            line-height: 1.6;

            white-space: pre;

            word-break: normal;

            overflow-wrap: normal;
        }

        .code-header {
            display: flex;

            align-items: center;

            justify-content: space-between;

            min-height: 38px;

            padding: 6px 10px;

            background:
                rgba(255,255,255,.025);

            border-bottom:
                1px solid rgba(255,255,255,.06);

            border-radius:
                12px 12px 0 0;
        }

        .code-header span {
            font-size: .68rem;

            font-weight: 600;

            letter-spacing: .06em;

            color: #94a3b8;

            text-transform: uppercase;
        }

        .copy-btn {
            display: none;
        }

                /* Highlight.js — GitHub Dark theme */

        .hljs {
            color: #c9d1d9;
            background: transparent;
        }

        .hljs-doctag,
        .hljs-keyword,
        .hljs-meta .hljs-keyword,
        .hljs-template-tag,
        .hljs-template-variable,
        .hljs-type,
        .hljs-variable.language_ {
            color: #ff7b72;
        }

        .hljs-title,
        .hljs-title.class_,
        .hljs-title.class_.inherited__,
        .hljs-title.function_ {
            color: #d2a8ff;
        }

        .hljs-attr,
        .hljs-attribute,
        .hljs-literal,
        .hljs-meta,
        .hljs-number,
        .hljs-operator,
        .hljs-variable,
        .hljs-selector-attr,
        .hljs-selector-class,
        .hljs-selector-id {
            color: #79c0ff;
        }

        .hljs-regexp,
        .hljs-string,
        .hljs-meta .hljs-string {
            color: #a5d6ff;
        }

        .hljs-built_in,
        .hljs-symbol {
            color: #ffa657;
        }

        .hljs-comment,
        .hljs-code,
        .hljs-formula {
            color: #8b949e;
        }

        .hljs-name,
        .hljs-quote,
        .hljs-selector-tag,
        .hljs-selector-pseudo {
            color: #7ee787;
        }

        .hljs-subst {
            color: #c9d1d9;
        }

        .hljs-section {
            color: #1f6feb;
            font-weight: 700;
        }

        .hljs-bullet {
            color: #f2cc60;
        }

        .hljs-emphasis {
            color: #c9d1d9;
            font-style: italic;
        }

        .hljs-strong {
            color: #c9d1d9;
            font-weight: 700;
        }

        .hljs-addition {
            color: #aff5b4;
            background: rgba(46, 160, 67, 0.15);
        }

        .hljs-deletion {
            color: #ffdcd7;
            background: rgba(248, 81, 73, 0.15);
        }

        @media print {

            body {
                background: white;
                color: #111827;
            }

            .conversation-header {
                border-color: #d1d5db;
            }

            .conversation-header h1,
            .message-content h1,
            .message-content h2,
            .message-content h3,
            .message-content h4 {
                color: #111827;
            }

            .message-content pre {
                break-inside: avoid;
            }

            .message-content pre {
                white-space: pre-wrap;
                overflow-wrap: break-word;
                page-break-inside: avoid;
            }

            .message {
                page-break-inside: avoid;
            }
        }
    `;
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


// Rename Current Chat ************************
function renameCurrentChat() {

    const currentTitle =
    document.getElementById("chatTitle");

    const chat =
        getCurrentChat();

    if (!chat) return;

    const titleInput =
        document.createElement("input");

    titleInput.size = chat.title.length;

    titleInput.maxLength = 100;

    titleInput.value =
        chat.title;

    titleInput.style.width =
    `${Math.max(chat.title.length + 2, 10)}ch`;

    titleInput.className =
        "chat-title-input";

    currentTitle.replaceWith(titleInput);

    titleInput.focus();

    titleInput.select();

    let renameSaved = false;

    function saveRename() {

        if (renameSaved) return;

        renameSaved = true;

        const newTitle =
            titleInput.value.trim();

        if (newTitle) {
            chat.title = newTitle;
        }


        const newHeading =
            document.createElement("h1");

        newHeading.id = "chatTitle";

        newHeading.textContent =
            chat.title;

        document
            .querySelector(".chat-title-input")
            ?.replaceWith(newHeading);


        saveChats();

        loadChat(chat.id);
    }

    titleInput.addEventListener(
        "keydown",
        (e) => {

            if (e.key === "Enter") {
                saveRename();
            }
        }
    );

    titleInput.addEventListener(
        "keydown",
        (e) => {

            if (e.key === "Escape") {

                renameSaved = true;

                const newHeading =
                    document.createElement("h1");

                newHeading.id = "chatTitle";

                newHeading.textContent =
                    chat.title;

                titleInput.replaceWith(newHeading);
            }

        }
    );

    titleInput.addEventListener(
        "blur",
        saveRename
    );
}




// Auto Resize Textarea ************************
function autoResizeTextarea() {

    input.style.height = "auto";

    input.style.height = input.scrollHeight + "px";
}

input.addEventListener("input", autoResizeTextarea);


// Create and Display Message in Chat ************************
function createMessage(text, type, messageIndex = null, rawText = null) {

    const message = document.createElement("div");

    message.dataset.messageIndex = messageIndex;

    message.dataset.index =
    chatMessages.children.length;


    message.classList.add("message");
    message.classList.add("chat-message");
    message.classList.add(`${type}-message`);
    

    const content = document.createElement("div");

    content.classList.add("message-content");
    if (type === "ai") {

        content.innerHTML =
            text;

        enhanceCodeBlocks(
            content
        );

    } else {

        content.textContent =
            text;
    }

        



    const timestamp = document.createElement("div");

    timestamp.classList.add("message-time");

    timestamp.textContent =
    new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });



    message.appendChild(content);

    if (type === "user") {

        const actions = document.createElement("div");

        actions.className = "message-actions";

        actions.innerHTML = `
            <button class="copy-msg-btn">📋</button>
            <button class="edit-msg-btn">✏️</button>
            <button class="regen-msg-btn">↻</button>
        `;

        message.appendChild(actions);


        const copyBtn =
            actions.querySelector(".copy-msg-btn");

        copyBtn.addEventListener(
            "click",
            () => {

                navigator.clipboard.writeText(
                    rawText || content.innerText
                );
            }
        );


        const editBtn =
            actions.querySelector(".edit-msg-btn");

        editBtn.addEventListener(
            "click",
            () => {

                const currentChat =
                    getCurrentChat();

                if (!currentChat) return;

                input.value = text;

                autoResizeTextarea();

                input.focus();

                const userMessageIndex =
                    Number(
                        message.dataset.messageIndex
                    );

                if (userMessageIndex === -1) {
                    return;
                }


                currentChat.messages =
                    currentChat.messages.slice(
                        0,
                        userMessageIndex
                    );

                saveChats();

                loadChat(currentChat.id);

                const editedMessage =
                    chatMessages.lastElementChild;

                centerMessage(editedMessage);
            }
        );


        const regenBtn =
            actions.querySelector(".regen-msg-btn");

        regenBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "Regenerate clicked"
                );
            }
        );

    }
else if (type === "ai") {

    const actions =
        document.createElement("div");

    actions.className =
        "message-actions";

    actions.innerHTML = `
        <button class="copy-ai-btn">
            📋 Copy
        </button>
    `;

    message.appendChild(actions);


    const copyBtn =
        actions.querySelector(".copy-ai-btn");

    copyBtn.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    getPlainTextFromMessage(content)
                );

                copyBtn.textContent =
                    "✓ Copied!";

                setTimeout(() => {

                    copyBtn.textContent =
                        "📋 Copy";

                }, 2000);

            }
            catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );

            }
        }
    );

}

            




    message.appendChild(timestamp);

    chatMessages.appendChild(message);

    
}


// Show Typing Indicator ************************
function showTypingIndicator() {

    const typing = document.createElement("div");

    typing.classList.add(
        "message",
        "chat-message",
        "ai-message"
    );

    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="thinking-content">
            <span class="thinking-icon">✦</span>
            <span class="thinking-text">Norvalis is thinking</span>
            <span class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </span>
        </div>
    `;

    chatMessages.appendChild(typing);


}


// Remove Typing Indicator ************************
function removeTypingIndicator() {

    const typing = document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }

}


// Send Message ************************
async function sendMessage() {




    if (sendBtn.disabled) return;


    const text = input.value.trim();

    if (!text) return;

    if (!currentChatId) {
        createChat();
    }

    const currentChat = getCurrentChat();

    const shouldGenerateTitle = currentChat.messages.length === 0;

    if (isNewChat) {

        currentChat.title =  text.substring(0, 40);

        document.getElementById("chatTitle").textContent =
            currentChat.title;

        saveChats();

        renderChatList();


        chatHeader.style.display = "flex";
        isNewChat = false;
    }

    sendBtn.disabled = true;


    if (emptyState) {
        emptyState.style.display = "none";
    }





    const messageIndex =
        currentChat.messages.length;

    createMessage(
        text,
        "user",
        messageIndex
    );

    requestAnimationFrame(() => {

        const sentMessage =
            chatMessages.lastElementChild;

        centerMessage(sentMessage);
    });


    currentChat.messages.push({
        role: "user",
        content: text
    });





    saveChats();

    
    if (shouldGenerateTitle) {

    fetch("/generate-title", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: text
        })
    })
    .then(response => response.json())
    .then(titleData => {

        currentChat.title = titleData.title;

        saveChats();
        renderChatList();

        document.getElementById("chatTitle").textContent =
            titleData.title;
    });
}



    input.value = "";
    input.style.height = "auto";
    input.focus();


    showTypingIndicator();

    

try {

    const response = await fetch(
        "/chat-stream",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                history:
                    currentChat.messages
            })
        }
    );

    if (!response.ok) {
    throw new Error(
        `HTTP ${response.status}`
    );
}


removeTypingIndicator();

const streamMessage =
    createStreamingMessage();



streamMessage.message.style.minHeight =
    `${messages.clientHeight * 0.40}px`;

const userMessage =
    streamMessage.message.previousElementSibling;

requestAnimationFrame(() => {

    centerMessage(userMessage);

});


const contentElement =
    streamMessage.content;


contentElement.classList.add(
    "streaming-message"
);

const reader =
    response.body.getReader();



const decoder =
    new TextDecoder();

let buffer = "";

let fullText = "";

while (true) {

    const {
        done,
        value
    } = await reader.read();

    if (done) break;

    buffer += decoder.decode(
        value,
        { stream: true }
    );

    const lines =
        buffer.split("\n");

    buffer = lines.pop();

    for (const line of lines) {

        if (!line.trim()) continue;

        const data =
            JSON.parse(line);

        if (data.error) {

            console.error(data.error);

            createMessage(
                data.error,
                "ai"
            );

            break;
        }

        if (data.chunk) {

            console.log(data.chunk);

            fullText += data.chunk;

            contentElement.textContent =
                fullText;

        }

        if (data.done) {

            const normalizedText =
                normalizeMathNotation(
                    data.full_text
                );

            const html =
                marked.parse(
                    normalizedText
                );

            contentElement.innerHTML =
                html;

            enhanceCodeBlocks(
                contentElement
            );

            /* Apply syntax highlighting */
            contentElement
                .querySelectorAll("pre code")
                .forEach(block => {

                    hljs.highlightElement(
                        block
                    );
                });


            console.log(data.full_text);

            currentChat.messages.push({
                role: "assistant",
                raw: data.full_text,
                html: html
            });

            saveChats();

            const actions =
                document.createElement("div");

            actions.className =
                "message-actions";

            actions.innerHTML = `
                <button class="copy-ai-btn">
                    📋 Copy
                </button>
            `;

            streamMessage.message.appendChild(
                actions
            );


            const copyBtn =
                actions.querySelector(
                    ".copy-ai-btn"
                );

            copyBtn.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            getPlainTextFromMessage(contentElement)
                        );

                        copyBtn.textContent =
                            "✓ Copied!";

                        setTimeout(() => {

                            copyBtn.textContent =
                                "📋 Copy";

                        }, 2000);

                    }
                    catch (error) {

                        console.error(
                            "Copy failed:",
                            error
                        );

                    }
                }
            );

            


        contentElement.classList.remove(
            "streaming-message"
        );
        }
    }
}



}
catch(error) {

    removeTypingIndicator();

    createMessage(
        "Something went wrong.",
        "ai"
    );

    console.error(error);
}
finally {

    sendBtn.disabled = false;

    input.focus();
}

}





sendBtn.addEventListener("click", sendMessage);

searchInput.addEventListener(
    "input",
    (e) => {

        searchTerm =
            e.target.value
                .toLowerCase()
                .trim();

        renderChatList();
    }
);

input.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }

});




const suggestions = document.querySelectorAll(".suggestion-btn");

suggestions.forEach(button => {

    button.addEventListener("click", () => {

        input.value = button.textContent.trim();

        sendMessage();

    });

});


newChatBtn.addEventListener("click", startNewChat);

deleteChatBtn.addEventListener("click",deleteCurrentChat);



const logoHome = document.getElementById("logoHome");

logoHome.addEventListener("click", startNewChat);


// Start a New Chat ************************
function startNewChat() {

    removeTypingIndicator();

    chatMessages.innerHTML = "";

    emptyState.style.display =
        "flex";

    chatHeader.style.display =
        "none";

    document.getElementById("chatTitle").textContent = "New Chat";

    isNewChat = true;

    currentChatId = null;

    localStorage.setItem(
        "norvalis_current_chat",
        ""
    );

    input.value = "";

    input.focus();
}

function createStreamingMessage() {

    const message =
        document.createElement("div");


    message.classList.add(
        "message",
        "chat-message",
        "ai-message"
    );

    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );

    message.appendChild(content);

    chatMessages.appendChild(message);

    return {content,message};
}


// Apply Theme ************************
function applyTheme(themeName) {

    document.body.classList.remove(
        "theme-dark",
        "theme-light"
    );

    document.body.classList.add(
        `theme-${themeName}`
    );

    currentTheme = themeName;

    localStorage.setItem(
        "norvalis_theme",
        themeName
    );

    updateThemeButton();
}


function updateThemeButton() {

    if (currentTheme === "dark") {

        themeToggleBtn.textContent =
            "🌙 Dark Mode";

    } else {

        themeToggleBtn.textContent =
            "☀ Light Mode";
    }
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "norvalis_theme"
        );

    if (savedTheme) {

        applyTheme(savedTheme);

    } else {

        applyTheme("dark");
    }
}


function saveFontScale() {
    localStorage.setItem(
        "norvalis_font_scale",
        fontScale
    );
}

function loadFontScale() {

    const saved =
        localStorage.getItem(
            "norvalis_font_scale"
        );

    if(saved){
        fontScale = Number(saved);
    }

    document.documentElement.style.fontSize =
        fontScale + "%";

    fontSizeValue.textContent =
        fontScale + "%";
}


function showDeleteModal(onConfirm) {

    deleteModal.style.display = "flex";

    confirmDeleteBtn.onclick = () => {

        deleteModal.style.display = "none";

        onConfirm();
    };


    cancelDeleteBtn.onclick = () => {

        deleteModal.style.display = "none";
    };
}


function centerMessage(messageElement) {

    if (!messageElement) return;


    console.log("----------");

    console.log(
        "offsetTop:",
        messageElement.offsetTop
    );

    console.log(
        "clientHeight:",
        messages.clientHeight
    );

    console.log(
        "currentScroll:",
        messages.scrollTop
    );


    const containerRect =
        messages.getBoundingClientRect();

    const messageRect =
        messageElement.getBoundingClientRect();

    const targetScroll =
        messages.scrollTop +
        (messageRect.top - containerRect.top) -
        (messages.clientHeight * 0.02);
        /*adjust height of new/edited msgs*/


    console.log(
        "targetScroll:",
        targetScroll
    );

    messages.scrollTo({
        top: targetScroll,
        behavior: "smooth"
    });
}

exportMenuBtn.addEventListener(
    "click",
    (e) => {

        e.stopPropagation();

        exportMenu.style.display =
            exportMenu.style.display === "block"
                ? "none"
                : "block";
    }
);

document.addEventListener("keydown", (e) => {

    if (
        e.key === "Escape" &&
        deleteModal.style.display === "flex"
    ) {

        deleteModal.style.display = "none";
    }
});

exportTxtBtn.addEventListener(
    "click",
    () => {

        exportMenu.style.display = "none";

        exportCurrentChat();
    }
);

exportMdBtn.addEventListener(
    "click",
    () => {

        exportMenu.style.display = "none";

        exportCurrentChatMarkdown();
    }
);
exportPdfBtn.addEventListener(
    "click",
    () => {

        exportMenu.style.display =
            "none";

        exportCurrentChatPDF();
    }
);
exportHtmlBtn.addEventListener(
    "click",
    exportHTML
);


document.addEventListener("click", () => {

    document
        .querySelectorAll(".chat-menu")
        .forEach(menu => {
            menu.style.display = "none";
        });
    exportMenu.style.display = "none";

});


renameHeaderBtn.addEventListener(
    "click",
    renameCurrentChat
);


deleteModal.onclick = (e) => {

    if (e.target === deleteModal) {

        deleteModal.style.display = "none";
    }
};


settingsBtn.addEventListener(
    "click",
    () => {

        settingsModal.style.display =
            "flex";
    }
);



closeSettingsBtn.addEventListener(
    "click",
    () => {

        settingsModal.style.display =
            "none";
    }
);


// Close Settings Modal when clicking outside of it.
settingsModal.addEventListener(
    "click",
    (e) => {

        if (
            e.target === settingsModal
        ) {

            settingsModal.style.display =
                "none";
        }
    }
);

// Event listeners for Font Size Change.

const fontScales = [
    70,
    80,
    90,
    100,
    110,
    120,
    130
];

let fontScale = 100;


document.documentElement.style.fontSize =
    fontScale + "%";

fontIncreaseBtn.addEventListener(
    "click",
    () => {

        if (fontScale >= 140) return;

        fontScale += 10;

        document.documentElement.style.fontSize =
            fontScale + "%";

        fontSizeValue.textContent =
            fontScale + "%";
        
        saveFontScale();
    }
);

fontDecreaseBtn.addEventListener(
    "click",
    () => {

        if (fontScale <= 80) return;

        fontScale -= 10;

        document.documentElement.style.fontSize =
            fontScale + "%";

        fontSizeValue.textContent =
            fontScale + "%";

        saveFontScale();
    }
);

// Chat Data Controls ************************

exportChatsBtn.addEventListener(
    "click",
    exportAllChats
);

importChatsBtn.addEventListener(
    "click",
    () => {

        importChatsInput.click();

    }
);

importChatsInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];

        importAllChats(file);

        event.target.value = "";

    }
);


// Event listener for Theme Toggle.
themeToggleBtn.addEventListener(
    "click",
    () => {

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        applyTheme(nextTheme);
    }
);

loadFontScale();
loadChats();
loadTheme();