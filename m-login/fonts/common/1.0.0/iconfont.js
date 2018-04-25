;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-bbgkefu" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M175.014 605.006c6.852 0 13.492-0.843 20.006-2.017-12.098-34.733-20.006-71.459-20.006-110.315 0-38.861 7.909-75.582 20.006-110.315-0.365-0.067-0.753-0.050-1.118-0.113 45.764-131.799 170.722-226.567 318.106-226.567 147.38 0 272.337 94.769 318.106 226.567-0.365 0.062-0.758 0.045-1.118 0.113 12.098 34.733 20.006 71.454 20.006 110.315 0 38.856-7.909 75.582-20.006 110.315 6.516 1.174 13.154 2.017 20.006 2.017 62.041 0 112.331-50.291 112.331-112.331 0-47.246-29.24-87.512-70.55-104.109-45.69-166.526-197.742-289.052-378.776-289.052-181.039 0-333.085 122.526-378.777 289.052-41.31 16.598-70.55 56.862-70.55 104.109 0.001 62.040 50.292 112.331 112.332 112.331zM792.837 661.171c0-7.937 1.106-15.569 1.752-23.332v-145.166h-1.752c0-155.096-125.733-280.829-280.829-280.829s-280.829 125.733-280.829 280.829v145.166c0.646 7.763 1.752 15.395 1.752 23.332 0 115.454-69.781 214.435-169.373 257.593 34.199 14.822 71.808 23.236 111.455 23.236 68.129 0 129.755-25.241 178.383-65.59 39.968 40.827 91.64 65.59 158.612 65.59 67.742 0 119.774-24.943 159.837-66.029 48.707 40.619 110.54 66.029 178.911 66.029 39.648 0 77.256-8.414 111.456-23.236-99.588-43.158-169.374-142.139-169.374-257.593zM690.66 719.275c-18.664 19.934-42.068 35.002-68.353 44.168-4.892-26.027-26.678-46.106-54.133-46.106-31.020 0-56.166 25.146-56.166 56.166 0 31.020 25.146 56.166 56.166 56.166 22.854 0 44.528-4.095 65.22-10.492-31.368 38.407-70.987 67.152-121.386 66.658-179.029-1.758-226.724-338.753-226.724-338.753s206.825-85.647 230.538-167.734c0 0-23.348 151.177-63.72 166.975 0 0 156.438-54.11 172.238-115.538 0 0 10.148 122.554 113.703 115.538-0.002 0-12.173 87.169-47.383 172.951zM399.676 548.84c-31.020 0-56.166 25.146-56.166 56.166h112.331c0-31.020-25.146-56.166-56.166-56.166zM624.34 548.84c-31.020 0-56.166 25.146-56.166 56.166h112.331c0-31.020-25.146-56.166-56.166-56.166z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-icon-prev" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M706.487 194.496l-318 318.001 317.002 317.007c10.952 10.947 10.952 28.701 0 39.653s-28.701 10.952-39.652 0l-14.205-14.205 0.073-0.073-342.299-342.304 357.428-357.73c10.952-10.952 28.706-10.952 39.653 0 10.952 10.952 10.952 28.701 0 39.652z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-bbgyonghu" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M950.218 920.469c2.013 3.874 3.429 8.084 3.429 12.751 0 15.522-12.588 28.111-28.111 28.111-15.529 0-28.117-12.588-28.117-28.111h-0.72c-38.635-176.787-195.885-309.217-384.261-309.217s-345.632 132.429-384.266 309.217h-0.72c0 15.522-12.582 28.111-28.111 28.111-15.522 0-28.111-12.588-28.111-28.111 0-4.666 1.417-8.877 3.429-12.751 34.829-157.532 150.96-284.502 303.251-332.183-86.957-47.799-146.586-139.154-146.586-245.389 0-155.249 125.857-281.107 281.112-281.107 155.249 0 281.107 125.857 281.107 281.107 0 106.236-59.629 197.589-146.586 245.389 152.292 47.677 268.43 174.652 303.258 332.183zM737.324 342.897c0-124.198-100.687-224.885-224.885-224.885-124.205 0-224.885 100.687-224.885 224.885s100.681 224.885 224.885 224.885c124.198 0 224.885-100.687 224.885-224.885z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-bbgshenglvedian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M255.908 447.8c-35.414 0-64.121 28.707-64.121 64.121s28.707 64.121 64.121 64.121 64.121-28.707 64.121-64.121S291.322 447.8 255.908 447.8zM512.392 447.8c-35.414 0-64.121 28.707-64.121 64.121s28.707 64.121 64.121 64.121 64.121-28.707 64.121-64.121S547.806 447.8 512.392 447.8zM768.876 447.8c-35.414 0-64.121 28.707-64.121 64.121s28.707 64.121 64.121 64.121 64.121-28.707 64.121-64.121S804.291 447.8 768.876 447.8z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-bbgyiwenshixin" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.937 961.707c-248.403 0-449.77-201.368-449.77-449.77s201.368-449.77 449.77-449.77 449.77 201.368 449.77 449.77-201.368 449.77-449.77 449.77zM455.008 769.645c0 12.717 10.312 23.028 23.028 23.028h67.325c12.723 0 23.028-10.312 23.028-23.028v-67.33c0-12.723-10.305-23.028-23.028-23.028h-67.325c-12.717 0-23.028 10.312-23.028 23.028v67.33zM656.589 259.391c-37.668-27.166-84.906-42.492-141.818-42.492-43.313 0-79.823 11.328-109.502 30.411-43.644 27.712-68.332 74.381-74.139 137.552-0.461 5.009 3.070 15.41 19.116 15.41h75.353c10.811 0 14.056-10.659 14.893-15.719 2.344-14.291 8.011-30.95 17.007-45.242 12.184-19.341 32.844-23.742 62.001-23.742 29.612 0 50.042 2.587 61.203 18.266 11.194 15.743 16.77 33.143 16.77 52.223 0 16.602-8.32 31.793-18.351 45.624-5.521 8.057-12.818 15.449-21.825 22.247 0 0-59.19 37.966-85.204 68.466-12.852 15.073-15.742 55.367-17.131 86.901-0.208 4.813 2.035 14.651 14.595 14.651h77.259c9.597 0 13.702-9.367 14.117-13.959 0.826-9.119 2.052-29.864 3.694-35.009 4.785-15.079 17.721-28.257 32.31-39.575l30.039-20.729c27.11-21.133 48.761-38.467 58.301-52.067 16.305-22.381 27.768-49.913 27.762-82.561 0.002-53.315-18.855-93.518-56.451-120.656z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jianhao" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M808.914852 493.864968 215.092311 493.864968c-13.648858 0-24.740474-11.393491-24.740474-25.071002 0-13.676487 11.091616-25.071002 24.740474-25.071002l593.82254 0c13.648858 0 24.742521 11.394515 24.742521 25.071002C833.657372 482.4725 822.56371 493.864968 808.914852 493.864968z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-icon-next" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M317.62 206.497c-10.952-10.951-10.952-28.7 0-39.652 10.947-10.952 28.701-10.952 39.653 0l357.428 357.73L372.402 866.879l0.073 0.073-14.205 14.205c-10.951 10.952-28.7 10.952-39.652 0s-10.952-28.706 0-39.653L635.62 524.497 317.62 206.497 317.62 206.497z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxxuanxiangbukexuanze" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.667 64C264.247 64 63.638 264.438 63.638 511.687s200.609 447.687 448.029 447.687c247.423 0 448.033-200.438 448.033-447.687S759.09 64 511.667 64zM511.636 927.396c-229.497 0-415.552-186.118-415.552-415.708 0-108.415 41.493-207.131 109.451-281.14 0.083 0.088 0.154 0.184 0.239 0.271l589.859 584.364C721.332 884.779 621.463 927.396 511.636 927.396zM818.099 792.464l-589.435-583.96c-0.215-0.221-0.445-0.416-0.669-0.622 74.262-69.416 173.992-111.906 283.642-111.906 229.527 0 415.583 186.122 415.583 415.71C927.219 619.925 885.862 718.496 818.099 792.464z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxweixuanzhong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.739 63.563c-247.432 0-448.006 200.434-448.006 447.678 0 247.245 200.574 447.677 448.006 447.677 247.431 0 448.004-200.433 448.004-447.677C959.743 263.997 759.17 63.563 511.739 63.563zM511.723 926.941c-229.506 0-415.561-186.116-415.561-415.701s186.054-415.7 415.561-415.7 415.544 186.116 415.544 415.7S741.229 926.941 511.723 926.941z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxxuanzhongmian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M829.535 195.369c-175.086-175.179-458.999-175.179-634.084 0-175.117 175.18-175.117 459.202 0 634.382 175.086 175.18 458.999 175.18 634.084 0C1004.684 654.57 1004.684 370.549 829.535 195.369zM795.376 360.5 455.923 699.951c-6.25 6.252-16.377 6.252-22.627 0L229.611 496.284c-6.25-6.25-6.25-16.392 0-22.643 6.25-6.251 16.378-6.251 22.628 0L444.609 666.01l328.137-328.153c6.252-6.251 16.379-6.251 22.63 0C801.626 344.107 801.626 354.249 795.376 360.5z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxlajitong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M404.341 188.16c9.242 0 16.832-7.005 17.761-16l0.097 0 0-35.721c0-19.726 15.978-35.72 35.721-35.72l107.158 0c19.745 0 35.723 15.994 35.723 35.72l0 35.721 0.25 0c1.369 8.506 8.714 15 17.608 15 8.896 0 16.241-6.494 17.61-15l0.25 0 0-35.721C636.52 96.987 604.533 65 565.078 65L457.92 65c-39.452 0-71.44 31.987-71.44 71.439l0 35.721 0.097 0C387.506 181.155 395.096 188.16 404.341 188.16zM618.659 779.4c9.873 0 17.86-7.99 17.86-17.861l0-321.48c0-9.873-7.987-17.859-17.86-17.859-9.871 0-17.858 7.986-17.858 17.859l0 321.48C600.801 771.41 608.788 779.4 618.659 779.4zM940.139 243.6 82.861 243.6C72.987 243.6 65 251.588 65 261.46s7.988 17.859 17.861 17.859l125.02 0 0 607.239c0 39.453 31.987 71.441 71.438 71.441l464.358 0c39.455 0 71.441-31.988 71.441-71.441L815.118 279.319l125.02 0c9.872 0 17.861-7.987 17.861-17.859S950.011 243.6 940.139 243.6zM779.4 886.559c0 19.744-16.013 35.719-35.723 35.719L279.319 922.278c-19.744 0-35.72-15.975-35.72-35.719L243.599 279.319 779.4 279.319 779.4 886.559zM404.341 779.4c9.87 0 17.858-7.99 17.858-17.861l0-321.48c0-9.873-7.988-17.859-17.858-17.859-9.874 0-17.861 7.986-17.861 17.859l0 321.48C386.479 771.41 394.467 779.4 404.341 779.4z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxxia" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M896.896 288.907 512.323 673.48 127.749 288.907 63.646 288.907 512.323 737.584 961 288.907Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxshang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.999 287.945 63 736.944 127.148 736.944 511.999 352.093 896.851 736.944 961 736.944Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxgouxianquan" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.493 64C264.176 64 63.65 264.354 63.65 511.5S264.176 959 511.493 959c247.318 0 447.844-200.354 447.844-447.5S758.812 64 511.493 64zM511.463 927.036c-229.4 0-415.38-186.043-415.38-415.536 0-229.494 185.979-415.536 415.38-415.536 229.431 0 415.41 186.042 415.41 415.536C926.873 740.993 740.894 927.036 511.463 927.036zM800.858 347.169c-6.212-6.229-16.326-6.229-22.569 0L456.755 669.35 242.357 454.611c-6.212-6.243-16.326-6.243-22.568 0-6.243 6.243-6.243 16.356 0 22.6l225.685 226.043c6.243 6.243 16.357 6.243 22.6 0l332.785-333.471C807.102 363.541 807.102 353.412 800.858 347.169z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxjia" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M944.257 495.686l-415.95 0L528.307 80.352c0-9.041-7.282-16.355-16.292-16.355-9.04 0-16.356 7.314-16.356 16.355l0 415.333L79.71 495.685c-9.008 0-16.323 7.314-16.323 16.354 0 9.042 7.315 16.357 16.323 16.357l415.949 0 0 415.332c0 9.041 7.316 16.354 16.356 16.354 9.01 0 16.292-7.313 16.292-16.354L528.307 528.396l415.95 0c9.008 0 16.355-7.315 16.355-16.357C960.612 503 953.265 495.686 944.257 495.686z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-right" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1012.869565 249.07687 955.458783 185.633391 395.063652 727.841391 76.176696 399.09287 11.130435 462.380522 390.500174 853.481739 455.568696 790.194087 454.611478 789.23687Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-16pxxialaxian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.872 896.463 169.747 554.435l-0.083 0.081L148.5 533.439c-16.278-16.276-16.282-42.645-0.008-58.924 16.277-16.281 42.647-16.285 58.926-0.008l304.517 304.348 305.897-305.903c16.278-16.278 42.646-16.283 58.929-0.008 16.277 16.277 16.282 42.646 0.008 58.928l-34.101 34.025-0.243-0.162L511.872 896.463zM511.824 563.095 169.698 221.066l-0.082 0.082-21.163-21.077c-16.279-16.276-16.282-42.645-0.009-58.928 16.277-16.278 42.647-16.282 58.926-0.008l304.518 304.351 305.897-305.904c16.277-16.278 42.646-16.282 58.929-0.008 16.277 16.278 16.282 42.647 0.008 58.929l-34.101 34.024-0.243-0.162L511.824 563.095z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-28pxdui" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M780.618 781.907c-149.507 149.586-391.942 149.586-541.449 0-149.534-149.588-149.534-392.13 0-541.716 149.506-149.588 391.942-149.588 541.449 0C930.151 389.777 930.151 632.319 780.618 781.907zM722.438 329.569 451.927 600.107 297.322 445.529l-38.645 38.645 193.25 193.248 38.645-38.644 270.537-270.538L722.438 329.569z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-28pxcha" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M238.679 783.054c-150.26-150.26-150.207-393.934 0.106-544.274 150.339-150.314 394.016-150.367 544.275-0.107s150.204 393.934-0.108 544.246C632.612 933.258 388.938 933.313 238.679 783.054zM685.966 647.079 549.884 510.997l136.082-136.109c10.741-10.741 10.741-28.139 0-38.88-10.714-10.741-28.141-10.741-38.88 0L511.003 472.116 374.921 336.007c-10.741-10.741-28.166-10.741-38.88 0-10.741 10.741-10.741 28.139 0 38.88l136.083 136.109L336.041 647.079c-10.741 10.739-10.741 28.166 0 38.907 10.714 10.714 28.14 10.714 38.88 0l136.083-136.109 136.083 136.082c10.739 10.741 28.166 10.741 38.88 0.027C696.707 675.245 696.707 657.818 685.966 647.079z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-28pxchaxian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M564.502 510.77l317.864-317.874c14.846-14.846 14.846-38.915 0-53.761s-38.896-14.846-53.742 0L510.75 457.017 192.877 139.135c-14.846-14.846-38.896-14.846-53.744 0-14.844 14.846-14.844 38.915 0 53.761L456.999 510.77 139.133 828.643c-14.844 14.847-14.844 38.915 0 53.762 14.848 14.846 38.897 14.846 53.744 0L510.75 564.522l317.874 317.882c14.847 14.846 38.896 14.846 53.742 0 14.846-14.847 14.846-38.915 0-53.762L564.502 510.77z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-32pxtaoziicon" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M779.385 716.148C779.384 716.148 779.384 716.148 779.385 716.148c40.736-48.589 64.775-111.03 64.775-184.571 0-147.44-96.547-255.009-230.778-300.075-34.522-11.591-75.033-17.879-110.043-88.534-24.927 76.835-80.938 75.069-110.513 83.314C249.817 266.15 162.519 377.983 162.519 531.577c0 81.073 29.193 148.672 77.792 199.075l0 0c-63.722 11.312-111.003 40.141-111.003 40.141s70.626 88.292 174.039 106.247c103.415 17.953 193.163-0.509 200.457-41.235 0.234-1.309 0.377-2.626 0.438-3.949 3.873-0.01 7.727-0.077 11.569-0.182 14.183 38.439 101.637 55.143 201.721 37.297 104.857-18.696 176.467-110.647 176.467-110.647S845.036 727.657 779.385 716.148zM475.213 830.982c-11.409 28.082-101.843 35.957-175.839 17.801-71.793-17.616-124.279-73.568-124.279-73.568s41.008-15.935 90.213-21.555c55.148 45.208 128.47 72.263 209.907 77.323C475.214 830.982 475.214 830.982 475.213 830.982zM506.116 804.325c-2.836 0.065-5.671 0.102-8.505 0.102-165.278 0-305.882-103.703-305.882-277.398 0-143.931 96.219-251.019 205.937-277.696C434.439 240.392 494 230 504.611 195.867 532.5 245 571.155 243.97 603.861 254.832c127.166 42.232 212.632 142.835 212.632 276.197 0 148.382-118.546 242.762-250.625 267.121 24.054-14.057 58.038-38.466 89.18-81.608C693.5 660 701.845 630 701.845 573.149c-1.563-17.636-22.899-12.236-22.899 0 0 15.104 5.054 55.185-36.798 123.495C607.895 752.552 539.042 789.236 506.116 804.325zM711.818 842.08c-68.54 11.81-136.71 8.136-157.518-13.108 80.362-9.24 151.531-40.413 203.245-89.588l0 0c52.956 5.642 94.665 24.858 94.665 24.858S791.079 828.419 711.818 842.08zM690.896 525.351c6.599 0 11.949-5.351 11.949-11.949 0-6.598-5.351-11.949-11.949-11.949-6.598 0-11.949 5.351-11.949 11.949C678.946 520 684.297 525.351 690.896 525.351z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)