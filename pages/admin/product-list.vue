<template>
  <div>
    <section class="section no-top-pad">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h5 class="title is-5">
              プロダクト
            </h5>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <nuxt-link class="button is-primary" to="/admin/product-edit">
              追加
            </nuxt-link>
          </div>
        </div>
      </nav>
      <hr>
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>画像</th>
            <th>プロダクト</th>
            <th>コード</th>
            <th>ブランド</th>
            <th class="has-text-centered">
              ストック
            </th>
            <th class="has-text-centered">
              ステータス
            </th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <td />
            <td><a href="#">プロダクト 1</a></td>
            <td />
            <td />
            <td />
            <td />
            <td><a href="#"><span class="icon has-text-danger"><i class="fa fa-lg fa-times-circle" /></span></a></td>
          </tr>
          <tr>
            <th>2</th>
            <td />
            <td><a href="#">プロダクト 2</a></td>
            <td />
            <td />
            <td />
            <td />
            <td><a href="#"><span class="icon has-text-danger"><i class="fa fa-lg fa-times-circle" /></span></a></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {}
</script>
