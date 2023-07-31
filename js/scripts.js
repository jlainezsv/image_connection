//Sidebar
const menu = document.querySelector(".menu"); // get menu item for click event

menu.addEventListener("click", function () {
    expandSidebar();
    showHover();
    getSearch();
});

/**
 * expand sidebar if it is short, otherwise collapse it
 */
function expandSidebar() {
    document.querySelector("body").classList.toggle("short");
    let keepSidebar = document.querySelectorAll("body.short");
    if (keepSidebar.length === 1) {
        localStorage.setItem("keepSidebar", "true");
    } else {
        localStorage.removeItem("keepSidebar");
    }
}

/**
 * show hover effect on sidebar
 */
function showHover() {
    const li = document.querySelectorAll(".short .sidebar li .nav-link");
    if (li.length > 0) {
        li.forEach(function (item) {
            item.addEventListener("mouseover", function () {
                const text = item.querySelector(".text");
                text.classList.add("hover");
            });
            item.addEventListener("mouseout", function () {
                const text = item.querySelector(".text");
                text.classList.remove("hover");
            });
        });
    }
}

/**
 * get search button click if short sidebar or mobile
 */
function getSearch() {
    document.querySelector(".callSearch").addEventListener("click", function (e) {
        e.preventDefault();
        if (
            // document.querySelector("body").classList.contains("short") ||
            document.querySelector("nav").classList.contains("offcanvas offcanvas-end") ||
            window.innerWidth <= 844
        ) {
            document.querySelector(".searchWindow").classList.toggle("active");
        }
    });
    document
        .querySelector(".cancelSearch")
        .addEventListener("click", function () {
            document.querySelector(".searchWindow").classList.toggle("active");
        });
}

/**
 * check local storage for keep sidebar
 */
function showStoredSidebar() {
    if (localStorage.getItem("keepSidebar") === "true") {
        document.querySelector("body").classList.add("short");
        showHover();
        //getSearch();
    }
}

showStoredSidebar(); // show sidebar if stored in local storage


//Range component
function range() {
    return {
      minprice: 5, 
      maxprice: 500,
      min: 5, 
      max: 500,
      minthumb: 0,
      maxthumb: 0, 
      
      mintrigger() {   
        this.minprice = Math.min(this.minprice, this.maxprice - 5);      
        this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 1;
      },
       
      maxtrigger() {
        this.maxprice = Math.max(this.maxprice, this.minprice + 5); 
        this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 1);    
      }, 
    }
}


// Drag & Drops
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  function handleDrop(event) {
    this.isDragging = false;
    const fileList = event.dataTransfer.files;
    this.file = fileList[0];
  }

  function handleFileInput(event) {
    const fileList = event.target.files;
    this.file = fileList[0];
  }

  function removeFile() {
    this.file = null;
  }

  function fileExtension(file) {
    return file.name.split('.').pop();
  }

  window.handleDrop = handleDrop;
  window.handleFileInput = handleFileInput;
  window.removeFile = removeFile;
  window.formatSize = bytesToSize;
  window.fileExtension = fileExtension;
// END Drag & Drops