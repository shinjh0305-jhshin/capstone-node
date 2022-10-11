<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid text-white">
      <a href="#" class="navbar-brand text-white">우리동네 공유마켓</a>
      <div class="d-flex justify-content-end">
        <div class="px-3">채팅</div>
        <div class="px-3">로그인</div>
      </div>
    </div>
  </nav>
  <body>
    <div class="d-flex align-items-center" style="height: 90%">
      <div class="container-md text-center col-4 border border-2 p-5">
        <h1 class="mb-5">Login</h1>
        <form action="" method="post">
          <div class="mb-2 row">
            <label for="userID" class="col-sm-4 col-form-label">ID</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" name="userID" id="userID" placeholder="ID"> <br/>
            </div>
          </div>

          <div class="mb-2 row">
            <label for="userPWD" class="col-sm-4 col-form-label">Password</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" name="userPWD" id="userPWD" placeholder="Password"> <br/>
            </div>
          </div>

          <button class="btn btn-danger w-100" type="submit">Login</button>

        </form>
        <p id="noAccount">If you don't have an account....</p>
        <button class="btn btn-primary w-100"  onclick="location.href='http://www.naver.com'">Create account</button>
      </div>
    </div>
  </body>
</template>

<style>
ul {
  list-style-type: none;
}

nav {
  background-color: #0b2239;
}
#noAccount {
  margin-top: 0.9em; 
}
</style>